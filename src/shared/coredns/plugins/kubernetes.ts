import { IPlugin } from '../plugin';

export interface IKubernetesTLS {
  cert: string;
  key: string;
  cacert: string;
}

export interface IKubernetesKubeconfig {
  path: string;
  context?: string;
}

export interface IKubernetes {
  zones: string[];
  endpoint?: string;
  tls?: IKubernetesTLS;
  kubeconfig?: IKubernetesKubeconfig;
  apiserverQps?: string;
  apiserverBurst?: string;
  apiserverMaxInflight?: string;
  namespaces: string[];
  labels?: string;
  pods?: string;
  endpointPodNames: boolean;
  ttl?: string;
  noendpoints: boolean;
  fallthrough?: string[];
  ignoreEmptyService: boolean;
  multicluster?: string[];
  startupTimeout?: string;
}

export interface IKubernetesPlugin extends IPlugin {
  name: 'kubernetes';
  config: IKubernetes;
}
