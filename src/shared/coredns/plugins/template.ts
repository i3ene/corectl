import { IPlugin } from '../plugin';

export interface ITemplateVar {
  name: string;
  expression: string;
}

export interface ITemplateEdnsError {
  code: string;
  reason?: string;
}

export interface ITemplate {
  queryClass?: string;
  queryType?: string;
  zones: string[];
  match: string[];
  vars: ITemplateVar[];
  expr: string[];
  answer: string[];
  additional: string[];
  authority: string[];
  rcode?: string;
  ederror?: ITemplateEdnsError;
  fallthrough?: string[];
}

export interface ITemplatePlugin extends IPlugin {
  name: 'template';
  config: ITemplate;
}
