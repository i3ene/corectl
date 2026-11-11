import { IPlugin } from '../plugin';

export interface IBind {
  /** Addresses or interface names to bind to. */
  addresses: string[];
  except: string[];
}

export interface IBindPlugin extends IPlugin {
  name: 'bind';
  config: IBind;
}
