import { IPlugin } from '../plugin';

export interface IGeoip {
  dbfile?: string;
  ednsSubnet: boolean;
}

export interface IGeoipPlugin extends IPlugin {
  name: 'geoip';
  config: IGeoip;
}
