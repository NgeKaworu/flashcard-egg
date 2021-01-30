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
      });
      retOk(ctx, res.ok);
    } catch (e) {
      retFail(ctx, e);
    }
  }

  // public async update() {
  //   const {
  //     ctx,
  //     app: { db },
  //   } = this;
  // }

  // public async list() {
  //   const {
  //     ctx,
  //     app: { db },
  //   } = this;
  // }
}
