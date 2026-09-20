import { IPlugin } from '../plugin';

export enum LoadbalanceType {
  RoundRobin = 'round_robin',
  Weighted = 'weighted',
}

export type LoadbalanceStrategy =
  { type: LoadbalanceType.RoundRobin } | { type: LoadbalanceType.Weighted; weightFile: string };

export interface ILoadbalance {
  strategy?: LoadbalanceStrategy;
  reload?: string;
  prefer: string[];
}

export interface ILoadbalancePlugin extends IPlugin {
  name: 'loadbalance';
  config: ILoadbalance;
}
