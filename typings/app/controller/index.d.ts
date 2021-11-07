// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportRecord from '../../../app/controller/record';

declare module 'egg' {
  interface IController {
    record: ExportRecord;
  }
}
