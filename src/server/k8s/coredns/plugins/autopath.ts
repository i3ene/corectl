import { IAutopath, IAutopathPlugin } from '../../../../shared/coredns/plugins/autopath';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Autopath implements IAutopath {
  public zones: string[] = [];
  public resolvConf?: string = undefined;
}

export class AutopathPlugin extends Plugin<Autopath> implements IAutopathPlugin {
  public readonly name = 'autopath';
  public config: Autopath = new Autopath();

  public override toString(): string {
    return formatDeclaration(this.name, [...this.config.zones, this.config.resolvConf ?? ''], []);
  }

  public static override parse(config: string): AutopathPlugin {
    const plugin = new AutopathPlugin();
    const { args } = parseDeclaration(config, plugin.name);
    if (args.length) {
      plugin.config.resolvConf = args[args.length - 1];
      plugin.config.zones = args.slice(0, -1);
    }
    return plugin;
  }
}
