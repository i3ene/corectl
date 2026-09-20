import { IHosts, IHostsPlugin } from '../../../../shared/coredns/plugins/hosts';
import { Plugin } from '../plugin';

export class Hosts implements IHosts {
  public file?: string = undefined;
  public zones: string[] = [];
  public inline: string[] = [];
  public ttl?: string = undefined;
  public noReverse = false;
  public reload?: string = undefined;
  public fallthrough?: string[] = undefined;
}

export class HostsPlugin extends Plugin<Hosts> implements IHostsPlugin {
  public readonly name = 'hosts';
  public config: Hosts = new Hosts();

  public override toString(): string {
    const header = [this.config.file, ...this.config.zones].filter(Boolean).join(' ');
    const lines = [...this.config.inline];
    if (this.config.ttl) lines.push(`ttl ${this.config.ttl}`);
    if (this.config.noReverse) lines.push('no_reverse');
    if (this.config.reload) lines.push(`reload ${this.config.reload}`);
    if (this.config.fallthrough) {
      lines.push(
        `fallthrough${this.config.fallthrough.length ? ` ${this.config.fallthrough.join(' ')}` : ''}`,
      );
    }

    if (!lines.length) return `${this.name}${header ? ` ${header}` : ''}`;
    return `${this.name}${header ? ` ${header}` : ''} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`;
  }

  public static override parse(config: string): HostsPlugin {
    const plugin = new HostsPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^hosts(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();

    if (!hasBlock) {
      const inlineMatch = /^hosts(?:\s+([\s\S]+))?$/.exec(declaration);
      if (inlineMatch?.[1]) {
        const args = inlineMatch[1].trim().split(/\s+/);
        plugin.config.file = args[0];
        plugin.config.zones = args.slice(1);
      }
      return plugin;
    }

    const header = declaration.slice('hosts'.length, openBrace).trim();
    if (header) {
      const args = header.split(/\s+/);
      plugin.config.file = args[0];
      plugin.config.zones = args.slice(1);
    }

    const lines = declaration
      .slice(openBrace + 1, closeBrace)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const directive = parts[0];
      const values = parts.slice(1);
      switch (directive) {
        case 'ttl':
          if (values[0]) plugin.config.ttl = values[0];
          break;
        case 'no_reverse':
          plugin.config.noReverse = true;
          break;
        case 'reload':
          if (values[0]) plugin.config.reload = values[0];
          break;
        case 'fallthrough':
          plugin.config.fallthrough = values;
          break;
        default:
          plugin.config.inline.push(line);
          break;
      }
    }

    return plugin;
  }
}
