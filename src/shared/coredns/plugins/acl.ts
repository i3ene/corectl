import { IPlugin } from '../plugin';

export enum ACLAction {
  Allow = 'allow',
  Block = 'block',
}

export interface IACLRule {
  action: ACLAction;
  network: string;
}
export interface IACL {
  rules: IACLRule[];
}
export interface IACLPlugin extends IPlugin {
  name: 'acl';
  config: IACL;
}
