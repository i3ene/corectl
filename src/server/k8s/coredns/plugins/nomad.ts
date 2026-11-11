import { INomad, INomadPlugin } from '../../../../shared/coredns/plugins/nomad';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration, quote } from './util';

export class Nomad implements INomad {
  public zone?: string = undefined;
  public address?: string = undefined;
  public filter?: string = undefined;
  public token?: string = undefined;
  public region?: string = undefined;
  public namespace?: string = undefined;
  public ttl?: string = undefined;
}

type NomadOption = 'address' | 'filter' | 'token' | 'region' | 'namespace' | 'ttl';
const OPTIONS: NomadOption[] = ['address', 'filter', 'token', 'region', 'namespace', 'ttl'];

export class NomadPlugin extends Plugin<Nomad> implements INomadPlugin {
  public readonly name = 'nomad';
  public config: Nomad = new Nomad();

  public override toString(): string {
    const lines: string[] = [];
    for (const option of OPTIONS) {
      const value = this.config[option];
      if (value !== undefined) lines.push(`${option} ${quote(value)}`);
    }
    return formatDeclaration(this.name, [this.config.zone ?? ''], lines);
  }

  public static override parse(config: string): NomadPlugin {
    const plugin = new NomadPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.zone = args[0];
    for (const tokens of lines) {
      const option = OPTIONS.find((o) => o === tokens[0]);
      if (option && tokens[1] !== undefined) plugin.config[option] = tokens[1];
    }
    return plugin;
  }
}
