import { INsid, INsidPlugin } from '../../../../shared/coredns/plugins/nsid';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Nsid implements INsid {
  public data?: string = undefined;
}

export class NsidPlugin extends Plugin<Nsid> implements INsidPlugin {
  public readonly name = 'nsid';
  public config: Nsid = new Nsid();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.data ?? ''], []);
  }

  public static override parse(config: string): NsidPlugin {
    const plugin = new NsidPlugin();
    plugin.config.data = parseDeclaration(config, plugin.name).args[0];
    return plugin;
  }
}
