import { IDnstap, IDnstapPlugin, IDnstapTls } from '../../../../shared/coredns/plugins/dnstap';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Dnstap implements IDnstap {
  public listen = false;
  public socket?: string = undefined;
  public full = false;
  public writebuffer?: string = undefined;
  public queue?: string = undefined;
  public identity?: string = undefined;
  public version?: string = undefined;
  public extra?: string = undefined;
  public tls?: IDnstapTls = undefined;
  public skipverify = false;
}

export class DnstapPlugin extends Plugin<Dnstap> implements IDnstapPlugin {
  public readonly name = 'dnstap';
  public config: Dnstap = new Dnstap();

  public override toString(): string {
    const c = this.config;
    const args = [
      c.listen ? 'listen' : undefined,
      c.socket,
      c.full ? 'full' : undefined,
      c.writebuffer,
      c.queue,
    ].filter((a): a is string => !!a);
    const lines: string[] = [];
    if (c.identity !== undefined) lines.push(line('identity', c.identity));
    if (c.version !== undefined) lines.push(line('version', c.version));
    if (c.extra !== undefined) lines.push(line('extra', c.extra));
    if (c.tls) lines.push(line('tls', c.tls.cert, c.tls.key, c.tls.ca));
    if (c.skipverify) lines.push('skipverify');
    return formatDeclaration(this.name, args, lines);
  }

  public static override parse(config: string): DnstapPlugin {
    const plugin = new DnstapPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;

    let rest = args;
    if (rest[0] === 'listen' && rest.length > 1) {
      c.listen = true;
      rest = rest.slice(1);
    }
    if (rest.length) c.socket = rest[0];
    const numbers: string[] = [];
    for (const a of rest.slice(1)) {
      if (a === 'full') c.full = true;
      else numbers.push(a);
    }
    c.writebuffer = numbers[0];
    c.queue = numbers[1];

    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'identity':
          if (values[0] !== undefined) c.identity = values[0];
          break;
        case 'version':
          if (values[0] !== undefined) c.version = values[0];
          break;
        case 'extra':
          if (values[0] !== undefined) c.extra = values.join(' ');
          break;
        case 'tls':
          if (values.length >= 2) c.tls = { cert: values[0], key: values[1], ca: values[2] };
          break;
        case 'skipverify':
          c.skipverify = true;
          break;
      }
    }
    return plugin;
  }
}
