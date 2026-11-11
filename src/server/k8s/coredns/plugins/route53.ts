import {
  IRoute53,
  IRoute53AwsAccessKey,
  IRoute53Credentials,
  IRoute53Plugin,
} from '../../../../shared/coredns/plugins/route53';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Route53 implements IRoute53 {
  public zones: string[] = [];
  public awsAccessKey?: IRoute53AwsAccessKey = undefined;
  public awsEndpoint?: string = undefined;
  public credentials?: IRoute53Credentials = undefined;
  public fallthrough?: string[] = undefined;
  public refresh?: string = undefined;
}

export class Route53Plugin extends Plugin<Route53> implements IRoute53Plugin {
  public readonly name = 'route53';
  public config: Route53 = new Route53();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.awsAccessKey) {
      const { accessKeyId, secretAccessKey } = c.awsAccessKey;
      lines.push(line('aws_access_key', accessKeyId, secretAccessKey));
    }
    if (c.awsEndpoint) lines.push(line('aws_endpoint', c.awsEndpoint));
    if (c.credentials) {
      lines.push(line('credentials', c.credentials.profile, c.credentials.filename));
    }
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    if (c.refresh) lines.push(line('refresh', c.refresh));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): Route53Plugin {
    const plugin = new Route53Plugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'aws_access_key':
          plugin.config.awsAccessKey = { accessKeyId: values[0], secretAccessKey: values[1] };
          break;
        case 'aws_endpoint':
          if (values[0]) plugin.config.awsEndpoint = values[0];
          break;
        case 'credentials':
          if (values[0]) plugin.config.credentials = { profile: values[0], filename: values[1] };
          break;
        case 'fallthrough':
          plugin.config.fallthrough = values;
          break;
        case 'refresh':
          if (values[0]) plugin.config.refresh = values[0];
          break;
      }
    }
    return plugin;
  }
}
