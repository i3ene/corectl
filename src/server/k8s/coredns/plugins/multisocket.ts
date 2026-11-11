import { IMultisocket, IMultisocketPlugin } from '../../../../shared/coredns/plugins/multisocket';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Multisocket implements IMultisocket {
  public numSockets?: string = undefined;
}

export class MultisocketPlugin extends Plugin<Multisocket> implements IMultisocketPlugin {
  public readonly name = 'multisocket';
  public config: Multisocket = new Multisocket();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.numSockets ?? ''], []);
  }

  public static override parse(config: string): MultisocketPlugin {
    const plugin = new MultisocketPlugin();
    plugin.config.numSockets = parseDeclaration(config, plugin.name).args[0];
    return plugin;
  }
}
