import { ITls, ITlsAcme, ITlsPlugin, TlsClientAuth } from '../../../../shared/coredns/plugins/tls';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

const CLIENT_AUTH: string[] = [
  'nocert',
  'request',
  'require',
  'verify_if_given',
  'require_and_verify',
];

export class Tls implements ITls {
  public cert?: string = undefined;
  public key?: string = undefined;
  public ca?: string = undefined;
  public clientAuth?: TlsClientAuth = undefined;
  public keylog?: string = undefined;
  public acme?: ITlsAcme = undefined;
}

export class TlsPlugin extends Plugin<Tls> implements ITlsPlugin {
  public readonly name = 'tls';
  public config: Tls = new Tls();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.clientAuth) lines.push(line('client_auth', c.clientAuth));
    if (c.keylog) lines.push(line('keylog', c.keylog));
    if (c.acme) {
      const a = c.acme;
      lines.push(line('acme', ...a.domains));
      if (a.email) lines.push(line('email', a.email));
      if (a.ca) lines.push(line('ca', a.ca));
      if (a.storage) lines.push(line('storage', a.storage));
      if (a.caRoot) lines.push(line('ca_root', a.caRoot));
      if (a.resolver) lines.push(line('resolver', a.resolver));
    }
    return formatDeclaration(this.name, [c.cert ?? '', c.key ?? '', c.ca ?? ''], lines);
  }

  public static override parse(config: string): TlsPlugin {
    const plugin = new TlsPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    [c.cert, c.key, c.ca] = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'client_auth':
          if (CLIENT_AUTH.includes(values[0])) c.clientAuth = values[0] as TlsClientAuth;
          break;
        case 'keylog':
          if (values[0]) c.keylog = values[0];
          break;
        case 'acme':
          c.acme = { ...c.acme, domains: values };
          break;
        case 'email':
        case 'ca':
        case 'storage':
        case 'ca_root':
        case 'resolver': {
          if (!values[0]) break;
          const acme = (c.acme ??= { domains: [] });
          if (directive === 'ca_root') acme.caRoot = values[0];
          else acme[directive] = values[0];
          break;
        }
      }
    }
    return plugin;
  }
}
