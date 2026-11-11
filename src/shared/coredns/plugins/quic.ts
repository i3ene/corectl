import { IPlugin } from '../plugin';

export interface IQuic {
  maxStreams?: string;
  maxConnections?: string;
  workerPoolSize?: string;
}

export interface IQuicPlugin extends IPlugin {
  name: 'quic';
  config: IQuic;
}
