import { IPlugin } from '../plugin';

export interface IAutoDirectory {
  path: string;
  regexp?: string;
  originTemplate?: string;
}

export interface IAuto {
  zones: string[];
  directory?: IAutoDirectory;
  reload?: string;
}

export interface IAutoPlugin extends IPlugin {
  name: 'auto';
  config: IAuto;
}
