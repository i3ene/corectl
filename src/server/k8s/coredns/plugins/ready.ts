import { Plugin } from '../plugin';

export class ReadyConfig {
  public path: string = '/ready';
}

export class ReadyPlugin extends Plugin<ReadyConfig> {
  public readonly name = 'ready';
  public config: ReadyConfig = new ReadyConfig();

  public override toString(): string {
    return `${this.name} ${this.config.path}`.trim();
  }

  public static parse(config: string): ReadyPlugin {
    const p = new ReadyPlugin();
    if (!config) return p;
    const decl = config.trim();
    const m = /^ready\s*([^\s{]+)?/.exec(decl);
    if (m && m[1]) p.config.path = m[1];
    return p;
  }
}
