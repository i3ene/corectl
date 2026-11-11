import { IPlugin } from '../plugin';

export interface IAzure {
  /** Entries in the form `RESOURCE_GROUP:ZONE`. */
  zones: string[];
  tenant?: string;
  client?: string;
  secret?: string;
  subscription?: string;
  environment?: string;
  fallthrough?: string[];
  access?: 'public' | 'private';
  refresh?: string;
}

export interface IAzurePlugin extends IPlugin {
  name: 'azure';
  config: IAzure;
}
