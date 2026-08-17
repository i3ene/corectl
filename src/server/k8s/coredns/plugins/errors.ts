import { ParseCorefile } from '../corefile';
import { Plugin } from '../plugin';

export class ErrorsConfig {
  public log: boolean = true;
  public format: string = 'short';
}

@ParseCorefile()
export class ErrorsPlugin extends Plugin<ErrorsConfig> {
  public readonly name = 'errors';
  public config: ErrorsConfig = new ErrorsConfig();

  public override toString(): string {
    const opts: string[] = [];
    if (!this.config.log) opts.push('nolog');
    if (this.config.format) opts.push(this.config.format);
    return opts.length ? `${this.name} ${opts.join(' ')}` : this.name;
  }

  public static parseCorefile(config: string): ErrorsPlugin {
    const p = new ErrorsPlugin();
    if (!config) return p;
    let decl = config.trim();
    const block = /^errors\s*\{([\s\S]*)\}$/.exec(decl);
    if (block) {
      const inner = block[1]
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .map((l) => l.replace(/#.*/, '').replace(/;.*/, '').trim())
        .filter(Boolean);
      for (const line of inner) {
        if (/^nolog$/i.test(line)) p.config.log = false;
        else if (/^(short|json|long)$/i.test(line)) p.config.format = line.toLowerCase();
      }
      return p;
    }

    const parts = decl.split(/\s+/).slice(1);
    for (const part of parts) {
      if (!part) continue;
      if (/^nolog$/i.test(part)) p.config.log = false;
      else if (/^(short|json|long)$/i.test(part)) p.config.format = part.toLowerCase();
    }

    return p;
  }
}
