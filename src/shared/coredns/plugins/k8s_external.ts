import { IPlugin } from '../plugin';

export interface IK8sExternal {
  zones: string[];
  apex?: string;
  ttl?: string;
  headless: boolean;
  fallthrough?: string[];
}

export interface IK8sExternalPlugin extends IPlugin {
  name: 'k8s_external';
  config: IK8sExternal;
}
