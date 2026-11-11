import { IPlugin } from '../plugin';

export interface IHeaderRule {
  selector: 'query' | 'response';
  action: 'set' | 'clear';
  flags: string[];
}

export interface IHeader {
  rules: IHeaderRule[];
}

export interface IHeaderPlugin extends IPlugin {
  name: 'header';
  config: IHeader;
}
