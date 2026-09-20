import { IPlugin } from '../plugin';

export interface IReload {
  interval?: string;
  jitter?: string;
}

export interface IReloadPlugin extends IPlugin {
  name: 'reload';
  config: IReload;
}
