import { IPlugin } from '../plugin';

export interface IPprofBlock {
  rate?: string;
}

export interface IPprof {
  address?: string;
  block?: IPprofBlock;
}

export interface IPprofPlugin extends IPlugin {
  name: 'pprof';
  config: IPprof;
}
