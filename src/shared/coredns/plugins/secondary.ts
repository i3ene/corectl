import { IPlugin } from '../plugin';

export interface ISecondary {
  zones: string[];
  /** Addresses to fetch the zone from (`transfer from`). */
  transferFrom: string[];
  catalog?: string[];
  fallthrough?: string[];
}

export interface ISecondaryPlugin extends IPlugin {
  name: 'secondary';
  config: ISecondary;
}
