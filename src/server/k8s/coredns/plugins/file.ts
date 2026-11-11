import { IFile, IFilePlugin } from '../../../../shared/coredns/plugins/file';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class File implements IFile {
  public dbfile?: string = undefined;
  public zones: string[] = [];
  public reload?: string = undefined;
  public reloadByMtime = false;
  public fallthrough?: string[] = undefined;
}

export class FilePlugin extends Plugin<File> implements IFilePlugin {
  public readonly name = 'file';
  public config: File = new File();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.reload !== undefined) lines.push(line('reload', c.reload));
    if (c.reloadByMtime) lines.push('reload_by_mtime');
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    return formatDeclaration(this.name, [c.dbfile ?? '', ...c.zones], lines);
  }

  public static override parse(config: string): FilePlugin {
    const plugin = new FilePlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    if (args.length) {
      c.dbfile = args[0];
      c.zones = args.slice(1);
    }

    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'reload':
          if (values[0] !== undefined) c.reload = values[0];
          break;
        case 'reload_by_mtime':
          c.reloadByMtime = true;
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
      }
    }
    return plugin;
  }
}
