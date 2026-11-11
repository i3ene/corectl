import { IGeoip, IGeoipPlugin } from '../../../../shared/coredns/plugins/geoip';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Geoip implements IGeoip {
  public dbfile?: string = undefined;
  public ednsSubnet = false;
}

export class GeoipPlugin extends Plugin<Geoip> implements IGeoipPlugin {
  public readonly name = 'geoip';
  public config: Geoip = new Geoip();

  public override toString(): string {
    const c = this.config;
    return formatDeclaration(this.name, [c.dbfile ?? ''], c.ednsSubnet ? ['edns-subnet'] : []);
  }

  public static override parse(config: string): GeoipPlugin {
    const plugin = new GeoipPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    if (args.length) plugin.config.dbfile = args[0];
    if (lines.some(([directive]) => directive === 'edns-subnet')) plugin.config.ednsSubnet = true;
    return plugin;
  }
}
