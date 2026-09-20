import { IPlugin } from '../plugin';

export interface IHealth {
  address: string;
  duration?: string;
}

export interface IHealthPlugin extends IPlugin {
  name: 'health';
  config: IHealth;
}
