import { IBufsize, IBufsizePlugin } from '../../../../shared/coredns/plugins/bufsize';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Bufsize implements IBufsize {
  public size?: string = undefined;
}

export class BufsizePlugin extends Plugin<Bufsize> implements IBufsizePlugin {
  public readonly name = 'bufsize';
  public config: Bufsize = new Bufsize();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.size ?? ''], []);
  }

  public static override parse(config: string): BufsizePlugin {
    const plugin = new BufsizePlugin();
    const { args } = parseDeclaration(config, plugin.name);
    if (args[0]) plugin.config.size = args[0];
    return plugin;
  }
}
