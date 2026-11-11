import { IPlugin } from '../plugin';

export interface IGrpc {
  from?: string;
  to: string[];
  except: string[];
  tls?: string[];
  tlsServername?: string;
  policy?: 'random' | 'round_robin' | 'sequential';
  fallthrough?: string[];
}

export interface IGrpcPlugin extends IPlugin {
  name: 'grpc';
  config: IGrpc;
}
