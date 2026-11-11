import { IPlugin } from '../plugin';

export type IMinimal = Record<string, never>;

export interface IMinimalPlugin extends IPlugin {
  name: 'minimal';
  config: IMinimal;
}
