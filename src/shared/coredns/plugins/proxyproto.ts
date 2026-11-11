import { IPlugin } from '../plugin';

export type ProxyprotoDefault = 'use' | 'ignore' | 'reject' | 'skip';

export interface IProxyprotoUdpSessionTracking {
  duration: string;
  maxSessions?: string;
}

export interface IProxyproto {
  allow: string[];
  default?: ProxyprotoDefault;
  udpSessionTracking?: IProxyprotoUdpSessionTracking;
  tlvMetadata: boolean;
}

export interface IProxyprotoPlugin extends IPlugin {
  name: 'proxyproto';
  config: IProxyproto;
}
