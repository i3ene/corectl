import { IPlugin } from '../plugin';

export interface IErrors {
  stacktrace: boolean;
  consolidate?: IErrorsConsolidate;
}

export interface IErrorsConsolidate {
  duration: string;
  regexp: string;
  level?: string;
  showFirst: boolean;
}

export interface IErrorsPlugin extends IPlugin {
  name: 'errors';
  config: IErrors;
}
