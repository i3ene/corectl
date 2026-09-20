import { ILog, ILogPlugin } from '../../../../shared/coredns/plugins/log';
import { Plugin } from '../plugin';

export class Log implements ILog {
  public names: string[] = [];
  public format?: string = undefined;
  public classes: string[] = [];
}

export class LogPlugin extends Plugin<Log> implements ILogPlugin {
  public readonly name = 'log';
  public config: Log = new Log();

  public override toString(): string {
    const header = [...this.config.names, this.config.format].filter(Boolean).join(' ');
    if (!this.config.classes.length) return `${this.name}${header ? ` ${header}` : ''}`;

    return `${this.name}${header ? ` ${header}` : ''} {\n  class ${this.config.classes.join(
      ' ',
    )}\n}`;
  }

  public static override parse(config: string): LogPlugin {
    const plugin = new LogPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^log(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();
    const header = hasBlock
      ? declaration.slice('log'.length, openBrace).trim()
      : declaration.slice('log'.length).trim();
    const args = header ? header.split(/\s+/) : [];
    if (args.length > 1) {
      plugin.config.format = args.pop();
      plugin.config.names = args;
    } else if (args.length === 1 && /^(common|combined|json)$/.test(args[0])) {
      plugin.config.format = args[0];
    } else {
      plugin.config.names = args;
    }
    if (!hasBlock) return plugin;

    const lines = declaration
      .slice(openBrace + 1, closeBrace)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts[0] === 'class') plugin.config.classes.push(...parts.slice(1));
    }

    return plugin;
  }
}
