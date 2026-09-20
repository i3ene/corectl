import { IHealth, IHealthPlugin } from '../../../../shared/coredns/plugins/health';
import { Plugin } from '../plugin';

export class Health implements IHealth {
  public address?: string = undefined;
  public duration?: string | undefined = undefined;
}

export class HealthPlugin extends Plugin<Health> implements IHealthPlugin {
  public readonly name = 'health';
  public config: Health = new Health();

  public override toString(): string {
    const address = this.config.address ? ` ${this.config.address}` : '';
    if (!this.config.duration) return `${this.name}${address}`;

    return `${this.name}${address} {\n  lameduck ${this.config.duration}\n}`;
  }

  public static override parse(config: string): HealthPlugin {
    const plugin = new HealthPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const blockMatch = /^health(?:\s+([^\s{}]+))?\s*\{([\s\S]*)\}$/.exec(declaration);

    if (blockMatch) {
      plugin.config.address = blockMatch[1];
      const lameduckMatch = /^\s*lameduck\s+([^\s{}]+)\s*$/m.exec(blockMatch[2]);
      if (lameduckMatch) plugin.config.duration = lameduckMatch[1];
      return plugin;
    }

    const inlineMatch = /^health(?:\s+([^\s{}]+))?$/.exec(declaration);
    if (inlineMatch) plugin.config.address = inlineMatch[1];

    return plugin;
  }
}
