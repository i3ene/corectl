import {
  IErrors,
  IErrorsConsolidate,
  IErrorsPlugin,
} from '../../../../shared/coredns/plugins/errors';
import { Plugin } from '../plugin';

export class Errors implements IErrors {
  public stacktrace = false;
  public consolidate?: IErrorsConsolidate = undefined;
}

export class ErrorsPlugin extends Plugin<Errors> implements IErrorsPlugin {
  public readonly name = 'errors';
  public config: Errors = new Errors();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.stacktrace) lines.push('stacktrace');
    if (this.config.consolidate) {
      const { duration, regexp, level, showFirst } = this.config.consolidate;
      lines.push(
        `consolidate ${[duration, regexp, level, showFirst ? 'show_first' : undefined]
          .filter(Boolean)
          .join(' ')}`,
      );
    }
    if (!lines.length) return this.name;
    return `${this.name} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`;
  }

  public static override parse(config: string): ErrorsPlugin {
    const plugin = new ErrorsPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^errors(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();
    if (!hasBlock) return plugin;

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
        case 'stacktrace':
          plugin.config.stacktrace = true;
          break;
        case 'consolidate':
          if (values.length >= 2) {
            const showFirstIndex = values.indexOf('show_first', 2);
            plugin.config.consolidate = {
              duration: values[0],
              regexp: values[1],
              level: values[2] === 'show_first' ? undefined : values[2],
              showFirst: showFirstIndex !== -1,
            };
          }
          break;
      }
    }

    return plugin;
  }
}
