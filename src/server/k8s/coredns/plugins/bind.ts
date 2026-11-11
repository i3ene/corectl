import { IBind, IBindPlugin } from '../../../../shared/coredns/plugins/bind';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Bind implements IBind {
  public addresses: string[] = [];
  public except: string[] = [];
}

export class BindPlugin extends Plugin<Bind> implements IBindPlugin {
  public readonly name = 'bind';
  public config: Bind = new Bind();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.except.length) lines.push(line('except', ...this.config.except));
    return formatDeclaration(this.name, this.config.addresses, lines);
  }

  public static override parse(config: string): BindPlugin {
    const plugin = new BindPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.addresses = args;
    for (const [directive, ...values] of lines) {
      if (directive === 'except') plugin.config.except.push(...values);
    }
    return plugin;
  }
}
