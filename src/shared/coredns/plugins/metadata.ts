import { IPlugin } from '../plugin';

export interface IMetadata {
  zones: string[];
}

export interface IMetadataPlugin extends IPlugin {
  name: 'metadata';
  config: IMetadata;
}
