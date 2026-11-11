import { IAzure, IAzurePlugin } from '../../../../shared/coredns/plugins/azure';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Azure implements IAzure {
  public zones: string[] = [];
  public tenant?: string = undefined;
  public client?: string = undefined;
  public secret?: string = undefined;
  public subscription?: string = undefined;
  public environment?: string = undefined;
  public fallthrough?: string[] = undefined;
  public access?: 'public' | 'private' = undefined;
  public refresh?: string = undefined;
}

export class AzurePlugin extends Plugin<Azure> implements IAzurePlugin {
  public readonly name = 'azure';
  public config: Azure = new Azure();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.tenant) lines.push(line('tenant', c.tenant));
    if (c.client) lines.push(line('client', c.client));
    if (c.secret) lines.push(line('secret', c.secret));
    if (c.subscription) lines.push(line('subscription', c.subscription));
    if (c.environment) lines.push(line('environment', c.environment));
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    if (c.access) lines.push(line('access', c.access));
    if (c.refresh) lines.push(line('refresh', c.refresh));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): AzurePlugin {
    const plugin = new AzurePlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'tenant':
          if (values[0]) c.tenant = values[0];
          break;
        case 'client':
          if (values[0]) c.client = values[0];
          break;
        case 'secret':
          if (values[0]) c.secret = values[0];
          break;
        case 'subscription':
          if (values[0]) c.subscription = values[0];
          break;
        case 'environment':
          if (values[0]) c.environment = values[0];
          break;
        case 'fallthrough':
          c.fallthrough = values;
          break;
        case 'access':
          if (values[0] === 'public' || values[0] === 'private') c.access = values[0];
          break;
        case 'refresh':
          if (values[0]) c.refresh = values[0];
          break;
      }
    }
    return plugin;
  }
}
