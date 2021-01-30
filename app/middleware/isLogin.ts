import { Context } from 'egg';
import { ucHost } from '../../host';

// 这里是你自定义的中间件
export default function isLogin(): any {
  return async (ctx: Context, next: () => Promise<any>) => {
    const result = await ctx.curl(`${ucHost()}/IsLogin`);
    console.log(result);

    await next();
  };
}
