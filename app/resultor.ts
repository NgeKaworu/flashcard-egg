import { Context } from 'egg';

// RetOk 成功处理器
export function retOk(ctx: Context, data: any) {
  const res = {
    ok: true,
    data,
  };
  ctx.body = res;
}

// retOkWithTotal 成功处理器
export function retOkWithTotal(ctx: Context, data: any, total: number) {
  const res = {
    ok: true,
    data,
    total,
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
