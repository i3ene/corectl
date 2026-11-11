import { IK8sExternal, IK8sExternalPlugin } from '../../../../shared/coredns/plugins/k8s_external';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class K8sExternal implements IK8sExternal {
  public zones: string[] = [];
  public apex?: string = undefined;
  public ttl?: string = undefined;
  public headless = false;
  public fallthrough?: string[] = undefined;
}

export class K8sExternalPlugin extends Plugin<K8sExternal> implements IK8sExternalPlugin {
  public readonly name = 'k8s_external';
  public config: K8sExternal = new K8sExternal();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.apex !== undefined) lines.push(line('apex', c.apex));
    if (c.ttl !== undefined) lines.push(line('ttl', c.ttl));
    if (c.headless) lines.push('headless');
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): K8sExternalPlugin {
    const plugin = new K8sExternalPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;

    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'apex':
          if (values[0] !== undefined) c.apex = values[0];
          break;
        case 'ttl':
          if (values[0] !== undefined) c.ttl = values[0];
          break;
        case 'headless':
          c.headless = true;
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
      }
    }
    return plugin;
  }
}
