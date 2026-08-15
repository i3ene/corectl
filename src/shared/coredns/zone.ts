import { IPlugin } from './plugin';

export interface IZone {
  name: string;
  plugins: IPlugin[];
}
