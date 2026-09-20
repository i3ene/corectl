import { IPlugin } from '../plugin';

export interface ILog {
  names: string[];
  format?: string;
  classes: string[];
}

export interface ILogPlugin extends IPlugin {
  name: 'log';
  config: ILog;
}
