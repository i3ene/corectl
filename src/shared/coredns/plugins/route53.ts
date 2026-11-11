import { IPlugin } from '../plugin';

export interface IRoute53AwsAccessKey {
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface IRoute53Credentials {
  profile: string;
  filename?: string;
}

export interface IRoute53 {
  /** Entries in `ZONE:HOSTED_ZONE_ID` form. */
  zones: string[];
  awsAccessKey?: IRoute53AwsAccessKey;
  awsEndpoint?: string;
  credentials?: IRoute53Credentials;
  /** Present when `fallthrough` is enabled; an empty list means all zones. */
  fallthrough?: string[];
  refresh?: string;
}

export interface IRoute53Plugin extends IPlugin {
  name: 'route53';
  config: IRoute53;
}
