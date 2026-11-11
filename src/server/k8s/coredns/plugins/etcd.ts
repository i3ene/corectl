import { IEtcd, IEtcdCredentials, IEtcdPlugin } from '../../../../shared/coredns/plugins/etcd';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Etcd implements IEtcd {
  public zones: string[] = [];
  public fallthrough?: string[] = undefined;
  public path?: string = undefined;
  public endpoints: string[] = [];
  public credentials?: IEtcdCredentials = undefined;
  public tls?: string[] = undefined;
  public noApexFallback = false;
  public minLeaseTtl?: string = undefined;
  public maxLeaseTtl?: string = undefined;
}

export class EtcdPlugin extends Plugin<Etcd> implements IEtcdPlugin {
  public readonly name = 'etcd';
  public config: Etcd = new Etcd();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    if (c.path !== undefined) lines.push(line('path', c.path));
    if (c.endpoints.length) lines.push(line('endpoint', ...c.endpoints));
    if (c.credentials) {
      lines.push(line('credentials', c.credentials.username, c.credentials.password));
    }
    if (c.tls) lines.push(line('tls', ...c.tls));
    if (c.noApexFallback) lines.push('no_apex_fallback');
    if (c.minLeaseTtl !== undefined) lines.push(line('min-lease-ttl', c.minLeaseTtl));
    if (c.maxLeaseTtl !== undefined) lines.push(line('max-lease-ttl', c.maxLeaseTtl));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): EtcdPlugin {
    const plugin = new EtcdPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;

    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'fallthrough':
          c.fallthrough = values;
          break;
        case 'path':
          if (values[0] !== undefined) c.path = values[0];
          break;
        case 'endpoint':
          c.endpoints.push(...values);
          break;
        case 'credentials':
          if (values.length >= 2) c.credentials = { username: values[0], password: values[1] };
          break;
        case 'tls':
          c.tls = values;
          break;
        case 'no_apex_fallback':
          c.noApexFallback = true;
          break;
        case 'min-lease-ttl':
          if (values[0] !== undefined) c.minLeaseTtl = values[0];
          break;
        case 'max-lease-ttl':
          if (values[0] !== undefined) c.maxLeaseTtl = values[0];
          break;
      }
    }
    return plugin;
  }
}
