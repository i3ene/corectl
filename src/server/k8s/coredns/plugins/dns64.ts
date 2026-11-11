import { IDns64, IDns64Plugin } from '../../../../shared/coredns/plugins/dns64';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Dns64 implements IDns64 {
  public prefix?: string = undefined;
  public translateAll = false;
  public allowIpv4 = false;
}

export class Dns64Plugin extends Plugin<Dns64> implements IDns64Plugin {
  public readonly name = 'dns64';
  public config: Dns64 = new Dns64();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.translateAll) lines.push('translate_all');
    if (this.config.allowIpv4) lines.push('allow_ipv4');
    if (!lines.length) return formatDeclaration(this.name, [this.config.prefix ?? ''], []);
    if (this.config.prefix) lines.unshift(line('prefix', this.config.prefix));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): Dns64Plugin {
    const plugin = new Dns64Plugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    if (args[0]) plugin.config.prefix = args[0];
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'prefix':
          if (values[0]) plugin.config.prefix = values[0];
          break;
        case 'translate_all':
          plugin.config.translateAll = true;
          break;
        case 'allow_ipv4':
          plugin.config.allowIpv4 = true;
          break;
      }
    }
    return plugin;
  }
}
