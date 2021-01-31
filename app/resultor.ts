import { Context } from 'egg';

// RetOk 成功处理器
export function retOk(ctx: Context, data: any) {
  const res = {
    ok: true,
    data,
  };
  ctx.body = res;
}

// retOkWithPaging 成功处理器带分页信息
export function retOkWithPaging(
  ctx: Context,
  data: any,
  total: number,
  hasNext: boolean,
) {
  const res = {
    ok: true,
    data,
    total,
    hasNext,
  };
  ctx.body = res;
}

// RetFail 失败处理器
export function retFail(ctx: Context, e: Error) {
  const errMsg = e.message;
  const res = {
    ok: false,
    errMsg,
  };

  ctx.logger.warn(e);

  ctx.body = res;
}
