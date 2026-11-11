import { IPlugin } from '../plugin';

export type TlsClientAuth =
  'nocert' | 'request' | 'require' | 'verify_if_given' | 'require_and_verify';

export interface ITlsAcme {
  domains: string[];
  email?: string;
  ca?: string;
  storage?: string;
  caRoot?: string;
  resolver?: string;
}

export interface ITls {
  cert?: string;
  key?: string;
  /** Optional CA certificate used to verify client certificates. */
  ca?: string;
  clientAuth?: TlsClientAuth;
  keylog?: string;
  acme?: ITlsAcme;
}

export interface ITlsPlugin extends IPlugin {
  name: 'tls';
  config: ITls;
}
