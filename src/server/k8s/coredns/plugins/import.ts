import { IImport, IImportPlugin } from '../../../../shared/coredns/plugins/import';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Import implements IImport {
  public pattern?: string = undefined;
}

export class ImportPlugin extends Plugin<Import> implements IImportPlugin {
  public readonly name = 'import';
  public config: Import = new Import();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.pattern ?? ''], []);
  }

  public static override parse(config: string): ImportPlugin {
    const plugin = new ImportPlugin();
    const { args } = parseDeclaration(config, plugin.name);
    if (args.length) plugin.config.pattern = args[0];
    return plugin;
  }
}
