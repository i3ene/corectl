import { IForward, IForwardPlugin } from '../../../../shared/coredns/plugins/forward';
import { Plugin } from '../plugin';

export class Forward implements IForward {
  public upstreams: string[] = [];
  public options: string[] = [];
}

export class ForwardPlugin extends Plugin<Forward> implements IForwardPlugin {
  public readonly name = 'forward';
  public config: Forward = new Forward();

  public override toString(): string {
    const args = this.config.upstreams.join(' ');
    const opts = this.config.options.map((o) => `  ${o}`).join('\n');
    if (opts) {
      return `${this.name} ${args} {\n${opts}\n}`;
    }
    return `${this.name} ${args}`;
  }

  public static override parse(config: string): ForwardPlugin {
    const plugin = new ForwardPlugin();
    if (!config) return plugin;

    let decl = config.trim();

    const blockMatch = /^forward\s*([^\{\n]*)\{([\s\S]*)\}$/.exec(decl);
    if (blockMatch) {
      const argsPart = blockMatch[1].trim();
      const inner = blockMatch[2];
      if (argsPart) plugin.config.upstreams = argsPart.split(/\s+/).filter(Boolean);

      const lines = inner
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((l) => l.replace(/#.*/, '').replace(/;.*/, '').trim())
        .filter(Boolean);

      plugin.config.options = lines;
      return plugin;
    }

    const inlineMatch = /^forward\s+([\s\S]+)$/.exec(decl);
    if (inlineMatch) {
      const rest = inlineMatch[1].trim();
      plugin.config.upstreams = rest.split(/\s+/).filter(Boolean);
    }

    return plugin;
  }
}
