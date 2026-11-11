import { ISecondary, ISecondaryPlugin } from '../../../../shared/coredns/plugins/secondary';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Secondary implements ISecondary {
  public zones: string[] = [];
  public transferFrom: string[] = [];
  public catalog?: string[] = undefined;
  public fallthrough?: string[] = undefined;
}

export class SecondaryPlugin extends Plugin<Secondary> implements ISecondaryPlugin {
  public readonly name = 'secondary';
  public config: Secondary = new Secondary();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.transferFrom.length) lines.push(line('transfer', 'from', ...c.transferFrom));
    if (c.catalog) lines.push(line('catalog', ...c.catalog));
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): SecondaryPlugin {
    const plugin = new SecondaryPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'transfer':
          if (values[0] === 'from') c.transferFrom.push(...values.slice(1));
          break;
        case 'catalog':
          c.catalog = values;
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
      }
    }
    return plugin;
  }
}
