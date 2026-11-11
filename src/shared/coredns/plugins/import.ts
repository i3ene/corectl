import { IPlugin } from '../plugin';

export interface IImport {
  pattern?: string;
}

export interface IImportPlugin extends IPlugin {
  name: 'import';
  config: IImport;
}
