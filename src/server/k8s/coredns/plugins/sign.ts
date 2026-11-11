import { ISign, ISignKey, ISignPlugin } from '../../../../shared/coredns/plugins/sign';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Sign implements ISign {
  public dbFile?: string = undefined;
  public zones: string[] = [];
  public keys: ISignKey[] = [];
  public directory?: string = undefined;
}

export class SignPlugin extends Plugin<Sign> implements ISignPlugin {
  public readonly name = 'sign';
  public config: Sign = new Sign();

  public override toString(): string {
    const lines = this.config.keys.map((key) => line('key', key.type, ...key.values));
    if (this.config.directory) lines.push(line('directory', this.config.directory));
    return formatDeclaration(this.name, [this.config.dbFile ?? '', ...this.config.zones], lines);
  }

  public static override parse(config: string): SignPlugin {
    const plugin = new SignPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.dbFile = args[0];
    plugin.config.zones = args.slice(1);
    for (const [directive, ...values] of lines) {
      if (directive === 'key' && (values[0] === 'file' || values[0] === 'directory')) {
        plugin.config.keys.push({ type: values[0], values: values.slice(1) });
      } else if (directive === 'directory' && values[0]) {
        plugin.config.directory = values[0];
      }
    }
    return plugin;
  }
}
