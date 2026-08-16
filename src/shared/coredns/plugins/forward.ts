import { IPlugin } from '../plugin';

export interface IForward {
  upstreams: string[];
  options: string[];
}

export interface IForwardPlugin extends IPlugin {
  name: 'forward';
  config: IForward;
}
