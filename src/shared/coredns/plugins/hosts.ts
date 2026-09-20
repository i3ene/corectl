import { IPlugin } from '../plugin';

export interface IHosts {
  file?: string;
  zones: string[];
  inline: string[];
  ttl?: string;
  noReverse: boolean;
  reload?: string;
  fallthrough?: string[];
}

export interface IHostsPlugin extends IPlugin {
  name: 'hosts';
  config: IHosts;
}
