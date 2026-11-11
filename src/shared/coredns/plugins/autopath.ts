import { IPlugin } from '../plugin';

export interface IAutopath {
  zones: string[];
  resolvConf?: string;
}

export interface IAutopathPlugin extends IPlugin {
  name: 'autopath';
  config: IAutopath;
}
