import { IPlugin } from '../plugin';

export interface ILoop {}

export interface ILoopPlugin extends IPlugin {
  name: 'loop';
  config: ILoop;
}
