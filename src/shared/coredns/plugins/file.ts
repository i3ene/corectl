import { IPlugin } from '../plugin';

export interface IFile {
  dbfile?: string;
  zones: string[];
  reload?: string;
  reloadByMtime: boolean;
  fallthrough?: string[];
}

export interface IFilePlugin extends IPlugin {
  name: 'file';
  config: IFile;
}
