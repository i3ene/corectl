import {
  IProxyproto,
  IProxyprotoPlugin,
  IProxyprotoUdpSessionTracking,
  ProxyprotoDefault,
} from '../../../../shared/coredns/plugins/proxyproto';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Proxyproto implements IProxyproto {
  public allow: string[] = [];
  public default?: ProxyprotoDefault = undefined;
  public udpSessionTracking?: IProxyprotoUdpSessionTracking = undefined;
  public tlvMetadata = false;
}

const DEFAULTS: ProxyprotoDefault[] = ['use', 'ignore', 'reject', 'skip'];

export class ProxyprotoPlugin extends Plugin<Proxyproto> implements IProxyprotoPlugin {
  public readonly name = 'proxyproto';
  public config: Proxyproto = new Proxyproto();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.allow.length) lines.push(line('allow', ...c.allow));
    if (c.default) lines.push(line('default', c.default));
    if (c.udpSessionTracking) {
      const { duration, maxSessions } = c.udpSessionTracking;
      lines.push(line('udp_session_tracking', duration, maxSessions));
    }
    if (c.tlvMetadata) lines.push('tlv_metadata');
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): ProxyprotoPlugin {
    const plugin = new ProxyprotoPlugin();
    for (const [directive, ...values] of parseDeclaration(config, plugin.name).lines) {
      switch (directive) {
        case 'allow':
          plugin.config.allow.push(...values);
          break;
        case 'default': {
          const value = DEFAULTS.find((d) => d === values[0]);
          if (value) plugin.config.default = value;
          break;
        }
        case 'udp_session_tracking':
          if (values[0]) {
            plugin.config.udpSessionTracking = { duration: values[0], maxSessions: values[1] };
          }
          break;
        case 'tlv_metadata':
          plugin.config.tlvMetadata = true;
          break;
      }
    }
    return plugin;
  }
}
