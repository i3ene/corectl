import { Plugin } from '../plugin';

export class LogConfig {
  public className: string = '';
  public options: string[] = [];
}

export class LogPlugin extends Plugin<LogConfig> {
  public readonly name = 'log';
  public config: LogConfig = new LogConfig();

  public override toString(): string {
    const args = [this.config.className, ...this.config.options].filter(Boolean).join(' ');
    return args ? `${this.name} ${args}` : this.name;
  }

  public static parse(config: string): LogPlugin {
    const p = new LogPlugin();
    if (!config) return p;
    let decl = config.trim();

    const block = /^log\s*\{([\s\S]*)\}$/.exec(decl);
    if (block) {
      const inner = block[1]
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((l) => l.replace(/#.*/, '').replace(/;.*/, '').trim())
        .filter(Boolean);
      for (const line of inner) {
        const parts = line.split(/\s+/);
        if (parts.length === 0) continue;
        if (!p.config.className) p.config.className = parts[0];
        if (parts.length > 1) p.config.options.push(...parts.slice(1));
      }
      return p;
    }

    const parts = decl.split(/\s+/).slice(1);
    if (parts.length > 0) p.config.className = parts[0];
    if (parts.length > 1) p.config.options.push(...parts.slice(1));

    return p;
  }
}
