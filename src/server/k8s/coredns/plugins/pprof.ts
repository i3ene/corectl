import { IPprof, IPprofBlock, IPprofPlugin } from '../../../../shared/coredns/plugins/pprof';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Pprof implements IPprof {
  public address?: string = undefined;
  public block?: IPprofBlock = undefined;
}

export class PprofPlugin extends Plugin<Pprof> implements IPprofPlugin {
  public readonly name = 'pprof';
  public config: Pprof = new Pprof();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.block) lines.push(line('block', this.config.block.rate));
    return formatDeclaration(this.name, [this.config.address ?? ''], lines);
  }

  public static override parse(config: string): PprofPlugin {
    const plugin = new PprofPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.address = args[0];
    for (const tokens of lines) {
      if (tokens[0] === 'block') plugin.config.block = { rate: tokens[1] };
    }
    return plugin;
  }
}
