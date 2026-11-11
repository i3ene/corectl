import { IMetadata, IMetadataPlugin } from '../../../../shared/coredns/plugins/metadata';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Metadata implements IMetadata {
  public zones: string[] = [];
}

export class MetadataPlugin extends Plugin<Metadata> implements IMetadataPlugin {
  public readonly name = 'metadata';
  public config: Metadata = new Metadata();

  public override toString(): string {
    return formatDeclaration(this.name, this.config.zones, []);
  }

  public static override parse(config: string): MetadataPlugin {
    const plugin = new MetadataPlugin();
    plugin.config.zones = parseDeclaration(config, plugin.name).args;
    return plugin;
  }
}
