import { IPlugin } from '../plugin';

export interface IDns64 {
  prefix?: string;
  translateAll: boolean;
  allowIpv4: boolean;
}

export interface IDns64Plugin extends IPlugin {
  name: 'dns64';
  config: IDns64;
}
