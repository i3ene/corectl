import { IPlugin } from '../plugin';

export interface IBufsize {
  size?: string;
}

export interface IBufsizePlugin extends IPlugin {
  name: 'bufsize';
  config: IBufsize;
}
