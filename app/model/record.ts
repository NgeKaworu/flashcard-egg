import * as mongodb from 'mongodb';

// 表名
export const TRecord = 't_record';

export interface Record {
  _id?: mongodb.ObjectId; // id
  id?: string; // id
  uid?: mongodb.ObjectId; // 所有者id
  createAt?: Date; // 创建时间
  updateAt?: Date; // 更新时间
  reviewAt?: Date; // 复习时间
  cooldownAt?: Date; // 冷却时间
  source?: string; // 原文
  translation?: string; // 译文
  inReview?: boolean; // 是否在复习中
  exp?: number; // 复习熟练度
}
