import { IPlugin } from '../plugin';

export interface ICachePolicy {
  capacity: string;
  ttl?: string;
  minTtl?: string;
}

export interface ICachePrefetch {
  amount: string;
  duration?: string;
  percentage?: string;
}

export interface ICacheServeStale {
  duration?: string;
  refreshMode?: string;
  verifyTimeout?: string;
}

export interface ICacheDisable {
  type: 'success' | 'denial';
  zones: string[];
}

export interface ICache {
  ttl?: string;
  zones: string[];
  success?: ICachePolicy;
  denial?: ICachePolicy;
  prefetch?: ICachePrefetch;
  serveStale?: ICacheServeStale;
  servfail?: string;
  disable: ICacheDisable[];
  keepttl: boolean;
}

export interface ICachePlugin extends IPlugin {
  name: 'cache';
  config: ICache;
}
