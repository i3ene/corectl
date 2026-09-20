import { IPlugin } from './plugin';

export interface IServerBlock {
  name: string;
  plugins: IPlugin[];
}
