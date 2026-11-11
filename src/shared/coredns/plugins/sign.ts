import { IPlugin } from '../plugin';

export interface ISignKey {
  type: 'file' | 'directory';
  values: string[];
}

export interface ISign {
  dbFile?: string;
  zones: string[];
  keys: ISignKey[];
  directory?: string;
}

export interface ISignPlugin extends IPlugin {
  name: 'sign';
  config: ISign;
}
