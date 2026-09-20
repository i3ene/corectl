import { IReload, IReloadPlugin } from '../../../../shared/coredns/plugins/reload';
import { Plugin } from '../plugin';

export class Reload implements IReload {
  public interval?: string = undefined;
  public jitter?: string = undefined;
}

export class ReloadPlugin extends Plugin<Reload> implements IReloadPlugin {
  public readonly name = 'reload';
  public config: Reload = new Reload();

  public override toString(): string {
    const args = [this.config.interval, this.config.jitter].filter(Boolean);
    return `${this.name}${args.length ? ` ${args.join(' ')}` : ''}`;
  }

  public static override parse(config: string): ReloadPlugin {
    const plugin = new ReloadPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const match = /^reload(?:\s+(\S+)(?:\s+(\S+))?)?$/.exec(declaration);
    if (match) {
      plugin.config.interval = match[1];
      plugin.config.jitter = match[2];
    }

    return plugin;
  }
}
