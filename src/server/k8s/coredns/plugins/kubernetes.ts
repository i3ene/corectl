import {
  IKubernetes,
  IKubernetesKubeconfig,
  IKubernetesPlugin,
  IKubernetesTLS,
} from '../../../../shared/coredns/plugins/kubernetes';
import { Plugin } from '../plugin';

export class Kubernetes implements IKubernetes {
  public zones: string[] = [];
  public endpoint?: string = undefined;
  public tls?: IKubernetesTLS = undefined;
  public kubeconfig?: IKubernetesKubeconfig = undefined;
  public apiserverQps?: string = undefined;
  public apiserverBurst?: string = undefined;
  public apiserverMaxInflight?: string = undefined;
  public namespaces: string[] = [];
  public labels?: string = undefined;
  public pods?: string = undefined;
  public endpointPodNames: boolean = false;
  public ttl?: string = undefined;
  public noendpoints: boolean = false;
  public fallthrough?: string[] = undefined;
  public ignoreEmptyService: boolean = false;
  public multicluster?: string[] = undefined;
  public startupTimeout?: string = undefined;
}

export class KubernetesPlugin extends Plugin<Kubernetes> implements IKubernetesPlugin {
  public readonly name = 'kubernetes';
  public config: Kubernetes = new Kubernetes();

  public override toString(): string {
    const zones = this.config.zones.join(' ');
    const lines: string[] = [];
    if (this.config.endpoint) lines.push(`  endpoint ${this.config.endpoint}`);
    if (this.config.tls) {
      lines.push(`  tls ${this.config.tls.cert} ${this.config.tls.key} ${this.config.tls.cacert}`);
    }
    if (this.config.kubeconfig) {
      const context = this.config.kubeconfig.context ? ` ${this.config.kubeconfig.context}` : '';
      lines.push(`  kubeconfig ${this.config.kubeconfig.path}${context}`);
    }
    if (this.config.apiserverQps) lines.push(`  apiserver_qps ${this.config.apiserverQps}`);
    if (this.config.apiserverBurst) lines.push(`  apiserver_burst ${this.config.apiserverBurst}`);
    if (this.config.apiserverMaxInflight) {
      lines.push(`  apiserver_max_inflight ${this.config.apiserverMaxInflight}`);
    }
    if (this.config.namespaces.length)
      lines.push(`  namespaces ${this.config.namespaces.join(' ')}`);
    if (this.config.labels) lines.push(`  labels ${this.config.labels}`);
    if (this.config.pods) lines.push(`  pods ${this.config.pods}`);
    if (this.config.endpointPodNames) lines.push('  endpoint_pod_names');
    if (this.config.ttl) lines.push(`  ttl ${this.config.ttl}`);
    if (this.config.noendpoints) lines.push('  noendpoints');
    if (this.config.fallthrough) {
      const zones = this.config.fallthrough.join(' ');
      lines.push(`  fallthrough${zones ? ` ${zones}` : ''}`);
    }
    if (this.config.ignoreEmptyService) lines.push('  ignore empty_service');
    if (this.config.multicluster) {
      const zones = this.config.multicluster.join(' ');
      lines.push(`  multicluster${zones ? ` ${zones}` : ''}`);
    }
    if (this.config.startupTimeout) lines.push(`  startup_timeout ${this.config.startupTimeout}`);

    if (!lines.length) return `${this.name}${zones ? ` ${zones}` : ''}`;
    return `${this.name}${zones ? ` ${zones}` : ''} {\n${lines.join('\n')}\n}`;
  }

  public static override parse(config: string): KubernetesPlugin {
    const plugin = new KubernetesPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^kubernetes(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();
    if (!hasBlock) {
      const inlineMatch = /^kubernetes(?:\s+([\s\S]+))?$/.exec(declaration);
      if (inlineMatch?.[1]) plugin.config.zones = inlineMatch[1].trim().split(/\s+/);
      return plugin;
    }

    const header = declaration.slice('kubernetes'.length, openBrace).trim();
    if (header) plugin.config.zones = header.split(/\s+/);
    const lines = declaration
      .slice(openBrace + 1, closeBrace)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      const parts = line.split(/\s+/);
      const directive = parts[0];
      const values = parts.slice(1);
      switch (directive) {
        case 'endpoint':
          if (values[0]) plugin.config.endpoint = values[0];
          break;
        case 'tls':
          if (values.length >= 3) {
            plugin.config.tls = { cert: values[0], key: values[1], cacert: values[2] };
          }
          break;
        case 'kubeconfig':
          if (values[0]) {
            plugin.config.kubeconfig = { path: values[0], context: values[1] };
          }
          break;
        case 'apiserver_qps':
          if (values[0]) plugin.config.apiserverQps = values[0];
          break;
        case 'apiserver_burst':
          if (values[0]) plugin.config.apiserverBurst = values[0];
          break;
        case 'apiserver_max_inflight':
          if (values[0]) plugin.config.apiserverMaxInflight = values[0];
          break;
        case 'namespaces':
          plugin.config.namespaces = values;
          break;
        case 'labels':
          plugin.config.labels = line.slice(directive.length).trim();
          break;
        case 'pods':
          if (values[0]) plugin.config.pods = values[0];
          break;
        case 'endpoint_pod_names':
          plugin.config.endpointPodNames = true;
          break;
        case 'ttl':
          if (values[0]) plugin.config.ttl = values[0];
          break;
        case 'noendpoints':
          plugin.config.noendpoints = true;
          break;
        case 'fallthrough':
          plugin.config.fallthrough = values;
          break;
        case 'ignore':
          if (values[0] === 'empty_service') plugin.config.ignoreEmptyService = true;
          break;
        case 'multicluster':
          plugin.config.multicluster = values;
          break;
        case 'startup_timeout':
          if (values[0]) plugin.config.startupTimeout = values[0];
          break;
      }
    }

    return plugin;
  }
}
