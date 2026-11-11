import { IPlugin } from '../plugin';

export interface INsid {
  data?: string;
}

export interface INsidPlugin extends IPlugin {
  name: 'nsid';
  config: INsid;
}
