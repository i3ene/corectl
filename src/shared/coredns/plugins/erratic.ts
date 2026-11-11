import { IPlugin } from '../plugin';

export interface IErraticAmount {
  amount?: string;
}

export interface IErraticDelay {
  amount?: string;
  duration?: string;
}

export interface IErratic {
  drop?: IErraticAmount;
  truncate?: IErraticAmount;
  delay?: IErraticDelay;
}

export interface IErraticPlugin extends IPlugin {
  name: 'erratic';
  config: IErratic;
}
