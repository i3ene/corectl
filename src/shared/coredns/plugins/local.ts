import { IPlugin } from '../plugin';

export interface ILocal {
  localhostPrefix?: 'on' | 'off';
}

export interface ILocalPlugin extends IPlugin {
  name: 'local';
  config: ILocal;
}
