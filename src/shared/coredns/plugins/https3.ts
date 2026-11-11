import { IPlugin } from '../plugin';

export interface IHttps3 {
  maxStreams?: string;
  maxConnections?: string;
}

export interface IHttps3Plugin extends IPlugin {
  name: 'https3';
  config: IHttps3;
}
