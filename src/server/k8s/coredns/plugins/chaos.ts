import { IChaos, IChaosPlugin } from '../../../../shared/coredns/plugins/chaos';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Chaos implements IChaos {
  public version?: string = undefined;
  public authors: string[] = [];
}

export class ChaosPlugin extends Plugin<Chaos> implements IChaosPlugin {
  public readonly name = 'chaos';
  public config: Chaos = new Chaos();

  public override toString(): string {
    const { version, authors } = this.config;
    // AUTHORS can only follow VERSION, so an empty version is emitted as ""
    const args = version || authors.length ? [version ?? '""'] : [];
    return formatDeclaration(this.name, [...args, ...authors], []);
  }

  public static override parse(config: string): ChaosPlugin {
    const plugin = new ChaosPlugin();
    const { args } = parseDeclaration(config, plugin.name);
    if (args[0]) plugin.config.version = args[0];
    plugin.config.authors = args.slice(1);
    return plugin;
  }
}
