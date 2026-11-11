import { IHttps, IHttpsPlugin } from '../../../../shared/coredns/plugins/https';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Https implements IHttps {
  public maxConnections?: string = undefined;
  public maxStreams?: string = undefined;
}

export class HttpsPlugin extends Plugin<Https> implements IHttpsPlugin {
  public readonly name = 'https';
  public config: Https = new Https();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.maxConnections !== undefined) lines.push(line('max_connections', c.maxConnections));
    if (c.maxStreams !== undefined) lines.push(line('max_streams', c.maxStreams));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): HttpsPlugin {
    const plugin = new HttpsPlugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [directive, value] of lines) {
      if (value === undefined) continue;
      if (directive === 'max_connections') plugin.config.maxConnections = value;
      else if (directive === 'max_streams') plugin.config.maxStreams = value;
    }
    return plugin;
  }
}
