import { IPlugin } from '../plugin';

export type IWhoami = Record<string, never>;

export interface IWhoamiPlugin extends IPlugin {
  name: 'whoami';
  config: IWhoami;
}
