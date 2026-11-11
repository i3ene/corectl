import { IRoot, IRootPlugin } from '../../../../shared/coredns/plugins/root';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Root implements IRoot {
  public path?: string = undefined;
}

export class RootPlugin extends Plugin<Root> implements IRootPlugin {
  public readonly name = 'root';
  public config: Root = new Root();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.path ?? ''], []);
  }

  public static override parse(config: string): RootPlugin {
    const plugin = new RootPlugin();
    plugin.config.path = parseDeclaration(config, plugin.name).args[0];
    return plugin;
  }
}
