// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportIsLogin from '../../../app/middleware/isLogin';

declare module 'egg' {
  interface IMiddleware {
    isLogin: typeof ExportIsLogin;
  }
}
