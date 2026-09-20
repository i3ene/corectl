import { IPlugin } from '../plugin';

export interface ILog {
  // TODO
}

export interface ILogPlugin extends IPlugin {
  name: 'log';
  config: ILog;
}
