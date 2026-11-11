import { IPlugin } from '../plugin';

export interface ICancel {
  timeout?: string;
}

export interface ICancelPlugin extends IPlugin {
  name: 'cancel';
  config: ICancel;
}
