import { IHttps3, IHttps3Plugin } from '../../../../shared/coredns/plugins/https3';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Https3 implements IHttps3 {
  public maxStreams?: string = undefined;
  public maxConnections?: string = undefined;
}

export class Https3Plugin extends Plugin<Https3> implements IHttps3Plugin {
  public readonly name = 'https3';
  public config: Https3 = new Https3();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.maxStreams !== undefined) lines.push(line('max_streams', c.maxStreams));
    if (c.maxConnections !== undefined) lines.push(line('max_connections', c.maxConnections));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): Https3Plugin {
    const plugin = new Https3Plugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [directive, value] of lines) {
      if (value === undefined) continue;
      if (directive === 'max_streams') plugin.config.maxStreams = value;
      else if (directive === 'max_connections') plugin.config.maxConnections = value;
    }
    return plugin;
  }
}
