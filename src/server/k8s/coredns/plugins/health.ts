import { ParseCorefile } from '../corefile';
import { Plugin } from '../plugin';

export class HealthConfig {
  public path: string = '/health';
}

@ParseCorefile()
export class HealthPlugin extends Plugin<HealthConfig> {
  public readonly name = 'health';
  public config: HealthConfig = new HealthConfig();

  public override toString(): string {
    return `${this.name} ${this.config.path}`.trim();
  }

  public static parseCorefile(config: string): HealthPlugin {
    const p = new HealthPlugin();
    if (!config) return p;
    const decl = config.trim();
    const m = /^health\s*([\S]*)/.exec(decl);
    if (m && m[1]) p.config.path = m[1];
    return p;
  }
}
