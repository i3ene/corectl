import { IGrpc, IGrpcPlugin } from '../../../../shared/coredns/plugins/grpc';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Grpc implements IGrpc {
  public from?: string = undefined;
  public to: string[] = [];
  public except: string[] = [];
  public tls?: string[] = undefined;
  public tlsServername?: string = undefined;
  public policy?: 'random' | 'round_robin' | 'sequential' = undefined;
  public fallthrough?: string[] = undefined;
}

export class GrpcPlugin extends Plugin<Grpc> implements IGrpcPlugin {
  public readonly name = 'grpc';
  public config: Grpc = new Grpc();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.except.length) lines.push(line('except', ...c.except));
    if (c.tls) lines.push(line('tls', ...c.tls));
    if (c.tlsServername !== undefined) lines.push(line('tls_servername', c.tlsServername));
    if (c.policy) lines.push(line('policy', c.policy));
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    return formatDeclaration(this.name, [c.from ?? '', ...c.to], lines);
  }

  public static override parse(config: string): GrpcPlugin {
    const plugin = new GrpcPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    if (args.length) {
      c.from = args[0];
      c.to = args.slice(1);
    }

    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'except':
          c.except.push(...values);
          break;
        case 'tls':
          c.tls = values;
          break;
        case 'tls_servername':
          if (values[0] !== undefined) c.tlsServername = values[0];
          break;
        case 'policy':
          if (['random', 'round_robin', 'sequential'].includes(values[0])) {
            c.policy = values[0] as Grpc['policy'];
          }
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
      }
    }
    return plugin;
  }
}
