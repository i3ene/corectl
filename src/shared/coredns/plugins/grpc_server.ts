import { IPlugin } from '../plugin';

export interface IGrpcServer {
  maxStreams?: string;
  maxConnections?: string;
}

export interface IGrpcServerPlugin extends IPlugin {
  name: 'grpc_server';
  config: IGrpcServer;
}
