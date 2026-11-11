import { IPlugin } from '../plugin';

export interface IClouddns {
  /** Entries in the form `ZONE:PROJECT_ID:HOSTED_ZONE_NAME`. */
  zones: string[];
  credentials?: string;
  endpoint?: string;
  fallthrough?: string[];
  refresh?: string;
}

export interface IClouddnsPlugin extends IPlugin {
  name: 'clouddns';
  config: IClouddns;
}
