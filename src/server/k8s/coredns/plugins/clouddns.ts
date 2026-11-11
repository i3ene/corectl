import { IClouddns, IClouddnsPlugin } from '../../../../shared/coredns/plugins/clouddns';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Clouddns implements IClouddns {
  public zones: string[] = [];
  public credentials?: string = undefined;
  public endpoint?: string = undefined;
  public fallthrough?: string[] = undefined;
  public refresh?: string = undefined;
}

export class ClouddnsPlugin extends Plugin<Clouddns> implements IClouddnsPlugin {
  public readonly name = 'clouddns';
  public config: Clouddns = new Clouddns();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.credentials) lines.push(line('credentials', c.credentials));
    if (c.endpoint) lines.push(line('endpoint', c.endpoint));
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    if (c.refresh) lines.push(line('refresh', c.refresh));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): ClouddnsPlugin {
    const plugin = new ClouddnsPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'credentials':
          if (values[0]) c.credentials = values[0];
          break;
        case 'endpoint':
          if (values[0]) c.endpoint = values[0];
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
        case 'refresh':
          if (values[0]) c.refresh = values[0];
          break;
      }
    }
    return plugin;
  }
}
