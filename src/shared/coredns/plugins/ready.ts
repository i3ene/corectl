import { IPlugin } from '../plugin';

export enum ReadyMonitor {
  UntilReady = 'until-ready',
  Continuously = 'continuously',
}

export interface IReady {
  address?: string;
  monitor?: ReadyMonitor;
}

export interface IReadyPlugin extends IPlugin {
  name: 'ready';
  config: IReady;
}
