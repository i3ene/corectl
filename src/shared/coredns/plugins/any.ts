import { IPlugin } from '../plugin';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IAny {}

export interface IAnyPlugin extends IPlugin {
  name: 'any';
  config: IAny;
}
