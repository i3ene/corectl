import { ILocal, ILocalPlugin } from '../../../../shared/coredns/plugins/local';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Local implements ILocal {
  public localhostPrefix?: 'on' | 'off' = undefined;
}

export class LocalPlugin extends Plugin<Local> implements ILocalPlugin {
  public readonly name = 'local';
  public config: Local = new Local();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.localhostPrefix) {
      lines.push(line('localhost_prefix', this.config.localhostPrefix));
    }
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): LocalPlugin {
    const plugin = new LocalPlugin();
    for (const tokens of parseDeclaration(config, plugin.name).lines) {
      if (tokens[0] === 'localhost_prefix' && (tokens[1] === 'on' || tokens[1] === 'off')) {
        plugin.config.localhostPrefix = tokens[1];
      }
    }
    return plugin;
  }
}
