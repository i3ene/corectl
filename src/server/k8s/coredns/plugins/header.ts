import { IHeader, IHeaderPlugin, IHeaderRule } from '../../../../shared/coredns/plugins/header';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Header implements IHeader {
  public rules: IHeaderRule[] = [];
}

export class HeaderPlugin extends Plugin<Header> implements IHeaderPlugin {
  public readonly name = 'header';
  public config: Header = new Header();

  public override toString(): string {
    const lines = this.config.rules.map((r) => line(r.selector, r.action, ...r.flags));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): HeaderPlugin {
    const plugin = new HeaderPlugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [selector, action, ...flags] of lines) {
      if (selector !== 'query' && selector !== 'response') continue;
      if (action !== 'set' && action !== 'clear') continue;
      plugin.config.rules.push({ selector, action, flags });
    }
    return plugin;
  }
}
