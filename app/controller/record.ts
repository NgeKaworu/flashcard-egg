import { Controller } from 'egg';
import { retFail, retOk, retOkWithPaging } from '../resultor';
import { Record as Row, TRecord } from '../model/record';
import { ObjectId } from 'mongodb';

export default class RecordController extends Controller {
  public async create() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      ctx.validate({
        source: 'string',
        translation: 'string',
      });
      const record: Row = {
        ...ctx.request.body,
        uid: new ObjectId(ctx.uid),
        createAt: new Date(),
        cooldownAt: new Date(),
        inReview: false,
        exp: 0,
      };

      const res = await db.collection(TRecord).insertOne(record);
      retOk(ctx, res.insertedId);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  public async remove() {
    const {
      ctx,
      app: { db },
    } = this;

    try {
      ctx.validate(
        {
          id: '_id',
        },
        ctx.params,
      );

      const res = await db.collection(TRecord).findOneAndDelete({
        _id: new ObjectId(ctx.params.id),
        uid: new ObjectId(ctx.uid),
      });
      retOk(ctx, res.ok);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  public async update() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      ctx.validate({
        id: '_id',
        source: { type: 'string', required: false },
        translation: { type: 'string', required: false },
      });

      const record: Row = {
        ...ctx.request.body,
        updateAt: new Date(),
        cooldownAt: new Date(),
        inReview: false,
        exp: 0,
      };

      const id = new ObjectId(record.id);
      delete record.id;

      const res = await db
        .collection(TRecord)
        .findOneAndUpdate(
          { _id: id, uid: new ObjectId(ctx.uid) },
          { $set: record },
        );
      retOk(ctx, res.ok);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  public async list() {
    const {
      ctx,
      app: { db },
    } = this;

    try {
      const query: Record<string, any> = ctx?.query as any;
      const inReview = query.inReview;
      if (inReview) {
        if (inReview === 'true') {
          query.inReview = true;
        }
        if (inReview === 'false') {
          query.inReview = false;
        }
      }
      ctx.validate(
        {
          type: {
            type: 'enum',
            required: false,
            values: ['enable', 'cooling', 'done'],
          },
          sort: 'string?',
          orderby: {
            type: 'int',
            required: false,
            values: [1, -1],
            convertType: 'int',
          },
          skip: { type: 'int', required: false, convertType: 'int' },
          limit: { type: 'int', required: false, convertType: 'int' },
          inReview: 'boolean?',
        },
        query,
      );

      const filter: { [key: string]: any } = {
        uid: new ObjectId(ctx.uid),
      };

      if (inReview) {
        filter.inReview = query.inReview;
      }

      // type 条件判断
      if (query.type) {
        switch (query.type) {
          case 'enable': {
            filter.cooldownAt = {
              $lte: new Date(),
            };
            filter.exp = {
              $ne: 100,
            };
            break;
          }
          case 'cooling':
            filter.cooldownAt = {
              $gt: new Date(),
            };
            break;
          case 'done':
            filter.exp = 100;
            break;
          default:
            ctx.logger.warn('invalidate type: ', query.type);
            break;
        }
      }

      // 分布逻辑
      const skip = +query.skip || 0,
        limit = +query.limit || 10;

      // 排序逻辑
      let sort: { [key: string]: 1 | -1 } = {
        createAt: -1,
      };
      if (query.sort && query.orderby) {
        sort = {
          [query.sort]: +query.orderby,
          ...sort,
        };
      }

      const res = db
        .collection(TRecord)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      const hasNext = await res.hasNext();
      const count = await res.count();
      const list = await res.toArray();

      retOkWithPaging(ctx, list, count, hasNext);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  // 选中单词加入复习
  public async review() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      ctx.validate({
        ids: {
          type: 'array',
          itemType: '_id',
        },
      });
      const body = ctx.request.body;

      const filter = {
        uid: new ObjectId(ctx.uid),
        _id: { $in: body.ids?.map(ObjectId.createFromHexString) },
      };
      const res = await db.collection(TRecord).updateMany(filter, {
        $set: {
          inReview: true,
        },
      });
      retOk(ctx, res);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  // 随机挑选几个单词复习
  public async randomReview() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      ctx.validate({
        num: 'int?',
      });
      const uid = new ObjectId(ctx.uid);
      const matcher = {
        uid,
        inReview: false,
        cooldownAt: {
          $lte: new Date(),
        },
      };
      const tRecord = db.collection(TRecord);
      const num = ctx.request.body.num || 3;
      const cursor = tRecord.aggregate<Row>([
        { $match: matcher },
        { $sample: { size: num } },
        { $project: { _id: 1 } },
      ]);

      const random = await cursor.toArray();
      const ids = random.map((i: Row) => new ObjectId(i?._id));

      const filter = {
        uid: new ObjectId(ctx.uid),
        _id: { $in: ids },
      };
      const res = await db.collection(TRecord).updateMany(filter, {
        $set: {
          inReview: true,
        },
      });

      retOk(ctx, res);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  // 设置复习结果，算法前端实现，后端只负责记录
  public async setReviewResult() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      ctx.validate({
        id: '_id',
        cooldownAt: 'moment',
        exp: 'int',
      });

      const body = ctx.request.body;
      const record: Row = {
        ...body,
        cooldownAt: new Date(body?.cooldownAt),
        inReview: false,
        reviewAt: new Date(),
      };

      const id = new ObjectId(record.id);
      delete record.id;

      const res = await db
        .collection(TRecord)
        .findOneAndUpdate(
          { _id: id, uid: new ObjectId(ctx.uid) },
          { $set: record },
        );
      retOk(ctx, res.ok);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }

  // 复习所有
  public async reviewAll() {
    const {
      ctx,
      app: { db },
    } = this;
    try {
      const filter = {
        uid: new ObjectId(ctx.uid),
        exp: { $ne: 100 },
        inReview: false,
        cooldownAt: {
          $lte: new Date(),
        },
      };

      const res = await db.collection(TRecord).updateMany(filter, {
        $set: {
          inReview: true,
        },
      });
      retOk(ctx, res);
    } catch (e: any) {
      retFail(ctx, e);
    }
  }
}
