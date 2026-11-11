import { IPlugin } from '../plugin';

export interface IView {
  name?: string;
  /** Expressions that must all evaluate to true. */
  expr: string[];
}

export interface IViewPlugin extends IPlugin {
  name: 'view';
  config: IView;
}
