import { Db } from 'mongodb';
import { TRecord } from '../app/model/record';

export default async function init(db: Db) {
  try {
    // 创建字条索引
    const record = db.collection(TRecord);
    const reuslt = await record.createIndexes([
      { key: { createAt: -1 } },
      { key: { reviewAt: -1 } },
      { key: { cooldownAt: -1 } },
      { key: { inReview: 1 } },
      { key: { exp: 1 } },
    ]);
    console.log(reuslt);
  } catch (e) {
    console.error(e, 'create indexs fail');
  }
}
