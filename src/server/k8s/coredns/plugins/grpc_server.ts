import { IGrpcServer, IGrpcServerPlugin } from '../../../../shared/coredns/plugins/grpc_server';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class GrpcServer implements IGrpcServer {
  public maxStreams?: string = undefined;
  public maxConnections?: string = undefined;
}

export class GrpcServerPlugin extends Plugin<GrpcServer> implements IGrpcServerPlugin {
  public readonly name = 'grpc_server';
  public config: GrpcServer = new GrpcServer();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.maxStreams !== undefined) lines.push(line('max_streams', c.maxStreams));
    if (c.maxConnections !== undefined) lines.push(line('max_connections', c.maxConnections));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): GrpcServerPlugin {
    const plugin = new GrpcServerPlugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [directive, value] of lines) {
      if (value === undefined) continue;
      if (directive === 'max_streams') plugin.config.maxStreams = value;
      else if (directive === 'max_connections') plugin.config.maxConnections = value;
    }
    return plugin;
  }
}
