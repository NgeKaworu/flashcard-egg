import { Controller } from 'egg';
import { retFail, retOk } from '../resultor';
import { Record, TRecord } from '../model/record';
import { ObjectID } from 'mongodb';

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
      const record: Record = {
        ...ctx.request.body,
        uid: new ObjectID(ctx.uid),
        createAt: new Date(),
        inReview: false,
        exp: 0,
      };

      const res = await db.collection(TRecord).insertOne(record);
      retOk(ctx, res.insertedId);
    } catch (e) {
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
          id: { type: '_id' },
        },
        ctx.params,
      );

      const res = await db.collection(TRecord).findOneAndDelete({
        _id: new ObjectID(ctx.params.id),
        uid: new ObjectID(ctx.uid),
      });
      retOk(ctx, res.ok);
    } catch (e) {
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
        id: { type: '_id' },
        source: { type: 'string', required: false },
        translation: { type: 'string', required: false },
      });

      const record: Record = {
        ...ctx.request.body,
        updateAt: new Date(),
        cooldownAt: new Date(),
        inReview: false,
        exp: 0,
      };

      const id = new ObjectID(record.id);
      delete record.id;

      const res = await db
        .collection(TRecord)
        .findOneAndUpdate(
          { _id: id, uid: new ObjectID(ctx.uid) },
          { $set: record },
        );
      retOk(ctx, res.ok);
    } catch (e) {
      retFail(ctx, e);
    }
  }

  public async list() {
    const {
      ctx,
      app: { db },
    } = this;

    try {
      ctx.validate(
        {
          type: {
            type: 'enum',
            required: false,
            values: ['enabled', 'cooling', 'done'],
          },
          sort: 'int?',
          orderBy: 'int?',
          skip: 'int?',
          limit: 'int?',
        },
        ctx.query,
      );

      // undo
      const record: Record = {
        ...ctx.request.body,
        updateAt: new Date(),
        cooldownAt: new Date(),
        inReview: false,
        exp: 0,
      };

      const id = new ObjectID(record.id);
      delete record.id;

      const res = await db
        .collection(TRecord)
        .findOneAndUpdate(
          { _id: id, uid: new ObjectID(ctx.uid) },
          { $set: record },
        );
      retOk(ctx, res.ok);
    } catch (e) {
      retFail(ctx, e);
    }
  }
}
