import { IPlugin } from '../plugin';

export interface INomad {
  zone?: string;
  address?: string;
  filter?: string;
  token?: string;
  region?: string;
  namespace?: string;
  ttl?: string;
}

export interface INomadPlugin extends IPlugin {
  name: 'nomad';
  config: INomad;
}
