import { IPlugin } from '../plugin';

export interface IDnstapTls {
  cert: string;
  key: string;
  ca?: string;
}

export interface IDnstap {
  listen: boolean;
  socket?: string;
  full: boolean;
  writebuffer?: string;
  queue?: string;
  identity?: string;
  version?: string;
  extra?: string;
  tls?: IDnstapTls;
  skipverify: boolean;
}

export interface IDnstapPlugin extends IPlugin {
  name: 'dnstap';
  config: IDnstap;
}
