import { IPlugin } from '../plugin';

export interface IChaos {
  version?: string;
  authors: string[];
}

export interface IChaosPlugin extends IPlugin {
  name: 'chaos';
  config: IChaos;
}
