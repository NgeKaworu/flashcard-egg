import { Context } from 'egg';
import { ucHost } from '../../host';

// 这里是你自定义的中间件
export default () => async (ctx: Context, next: () => Promise<any>) => {
  const auth = ctx.get('Authorization');

  if (!auth) {
    ctx.status = 401;
    return;
  }

  const {
    data: { data, ok },
  } = await ctx.curl(`${ucHost()}/isLogin`, {
    dataType: 'json',
    headers: {
      Authorization: auth,
    },
  });
  if (!ok) {
    ctx.status = 401;
    return;
  }
  ctx.uid = data;
  await next();
};
