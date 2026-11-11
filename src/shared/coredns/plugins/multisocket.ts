import { IPlugin } from '../plugin';

export interface IMultisocket {
  numSockets?: string;
}

export interface IMultisocketPlugin extends IPlugin {
  name: 'multisocket';
  config: IMultisocket;
}
