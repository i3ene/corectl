import { IPlugin } from '../plugin';

export interface IErrors {
  // TODO
}

export interface IErrorsPlugin extends IPlugin {
  name: 'errors';
  config: IErrors;
}
