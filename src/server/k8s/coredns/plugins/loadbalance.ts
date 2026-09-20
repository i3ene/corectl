import {
  ILoadbalance,
  ILoadbalancePlugin,
  LoadbalanceStrategy,
  LoadbalanceType,
} from '../../../../shared/coredns/plugins/loadbalance';
import { Plugin } from '../plugin';

export class Loadbalance implements ILoadbalance {
  public strategy?: LoadbalanceStrategy = undefined;
  public reload?: string = undefined;
  public prefer: string[] = [];
}

export class LoadbalancePlugin extends Plugin<Loadbalance> implements ILoadbalancePlugin {
  public readonly name = 'loadbalance';
  public config: Loadbalance = new Loadbalance();

  public override toString(): string {
    const header = this.formatStrategy();
    const lines: string[] = [];
    if (this.config.reload) lines.push(`reload ${this.config.reload}`);
    if (this.config.prefer.length) lines.push(`prefer ${this.config.prefer.join(' ')}`);

    if (!lines.length) return `${this.name}${header ? ` ${header}` : ''}`;
    return `${this.name}${header ? ` ${header}` : ''} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`;
  }

  private formatStrategy(): string {
    if (!this.config.strategy) return '';
    if (this.config.strategy.type === LoadbalanceType.RoundRobin) {
      return LoadbalanceType.RoundRobin;
    }
    return `weighted ${this.config.strategy.weightFile}`;
  }

  public static override parse(config: string): LoadbalancePlugin {
    const plugin = new LoadbalancePlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^loadbalance(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();
    const header = hasBlock
      ? declaration.slice('loadbalance'.length, openBrace).trim()
      : declaration.slice('loadbalance'.length).trim();

    if (header === LoadbalanceType.RoundRobin) {
      plugin.config.strategy = { type: LoadbalanceType.RoundRobin };
    } else if (header.startsWith(`${LoadbalanceType.Weighted} `)) {
      const weightFile = header.slice(`${LoadbalanceType.Weighted} `.length).trim();
      if (weightFile && !/\s/.test(weightFile)) {
        plugin.config.strategy = { type: LoadbalanceType.Weighted, weightFile };
      }
    }
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
        case 'reload':
          if (values[0]) plugin.config.reload = values[0];
          break;
        case 'prefer':
          plugin.config.prefer = values;
          break;
      }
    }

    return plugin;
  }
}
