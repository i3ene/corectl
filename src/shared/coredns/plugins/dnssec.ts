import { IPlugin } from '../plugin';

export interface IDnssecKey {
  source: 'file' | 'aws_secretsmanager';
  keys: string[];
}

export interface IDnssec {
  zones: string[];
  keys: IDnssecKey[];
  cacheCapacity?: string;
}

export interface IDnssecPlugin extends IPlugin {
  name: 'dnssec';
  config: IDnssec;
}
