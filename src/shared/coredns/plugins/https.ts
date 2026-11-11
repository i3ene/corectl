import { IPlugin } from '../plugin';

export interface IHttps {
  maxConnections?: string;
  maxStreams?: string;
}

export interface IHttpsPlugin extends IPlugin {
  name: 'https';
  config: IHttps;
}
