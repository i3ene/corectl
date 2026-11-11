import { IPlugin } from '../plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDebug {}

export interface IDebugPlugin extends IPlugin {
  name: 'debug';
  config: IDebug;
}
