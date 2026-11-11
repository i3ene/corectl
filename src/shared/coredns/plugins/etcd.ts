import { IPlugin } from '../plugin';

export interface IEtcdCredentials {
  username: string;
  password: string;
}

export interface IEtcd {
  zones: string[];
  fallthrough?: string[];
  path?: string;
  endpoints: string[];
  credentials?: IEtcdCredentials;
  tls?: string[];
  noApexFallback: boolean;
  minLeaseTtl?: string;
  maxLeaseTtl?: string;
}

export interface IEtcdPlugin extends IPlugin {
  name: 'etcd';
  config: IEtcd;
}
