import { IDnssec, IDnssecKey, IDnssecPlugin } from '../../../../shared/coredns/plugins/dnssec';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Dnssec implements IDnssec {
  public zones: string[] = [];
  public keys: IDnssecKey[] = [];
  public cacheCapacity?: string = undefined;
}

export class DnssecPlugin extends Plugin<Dnssec> implements IDnssecPlugin {
  public readonly name = 'dnssec';
  public config: Dnssec = new Dnssec();

  public override toString(): string {
    const lines = this.config.keys
      .filter((k) => k.keys.length)
      .map((k) => line('key', k.source, ...k.keys));
    if (this.config.cacheCapacity) lines.push(line('cache_capacity', this.config.cacheCapacity));
    return formatDeclaration(this.name, this.config.zones, lines);
  }

  public static override parse(config: string): DnssecPlugin {
    const plugin = new DnssecPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.zones = args;
    for (const [directive, source, ...values] of lines) {
      if (directive === 'key' && (source === 'file' || source === 'aws_secretsmanager')) {
        plugin.config.keys.push({ source, keys: values });
      } else if (directive === 'cache_capacity' && source) {
        plugin.config.cacheCapacity = source;
      }
    }
    return plugin;
  }
}
