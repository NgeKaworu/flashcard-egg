import { Controller } from 'egg';
import { retFail, retOk } from '../resultor';
import { Record, TRecord } from '../model/record';

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

  // public async remove() {
  //   const {
  //     ctx,
  //     app: { db },
  //   } = this;

  // }

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
