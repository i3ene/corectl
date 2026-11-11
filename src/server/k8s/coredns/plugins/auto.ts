import { IAuto, IAutoDirectory, IAutoPlugin } from '../../../../shared/coredns/plugins/auto';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Auto implements IAuto {
  public zones: string[] = [];
  public directory?: IAutoDirectory = undefined;
  public reload?: string = undefined;
}

export class AutoPlugin extends Plugin<Auto> implements IAutoPlugin {
  public readonly name = 'auto';
  public config: Auto = new Auto();

  public override toString(): string {
    const lines: string[] = [];
    const dir = this.config.directory;
    if (dir?.path) {
      const template = dir.regexp ? [dir.regexp, dir.originTemplate] : [];
      lines.push(line('directory', dir.path, ...template));
    }
    if (this.config.reload) lines.push(line('reload', this.config.reload));
    return formatDeclaration(this.name, this.config.zones, lines);
  }

  public static override parse(config: string): AutoPlugin {
    const plugin = new AutoPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'directory':
          if (values[0]) {
            plugin.config.directory = {
              path: values[0],
              regexp: values[1],
              originTemplate: values[2],
            };
          }
          break;
        case 'reload':
          if (values[0]) plugin.config.reload = values[0];
          break;
      }
    }
    return plugin;
  }
}
