import { IPlugin } from '../plugin';

export interface IPrometheus {
  address?: string;
  runtimeMetrics: boolean;
}

export interface IPrometheusPlugin extends IPlugin {
  name: 'prometheus';
  config: IPrometheus;
}
