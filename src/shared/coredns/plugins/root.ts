import { IPlugin } from '../plugin';

export interface IRoot {
  path?: string;
}

export interface IRootPlugin extends IPlugin {
  name: 'root';
  config: IRoot;
}
