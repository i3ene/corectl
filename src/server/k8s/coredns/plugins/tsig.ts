import { ITsig, ITsigPlugin, ITsigSecret } from '../../../../shared/coredns/plugins/tsig';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Tsig implements ITsig {
  public zones: string[] = [];
  public secrets: ITsigSecret[] = [];
  public secretsFile?: string = undefined;
  public require?: string[] = undefined;
  public requireOpcode?: string[] = undefined;
}

export class TsigPlugin extends Plugin<Tsig> implements ITsigPlugin {
  public readonly name = 'tsig';
  public config: Tsig = new Tsig();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    for (const s of c.secrets) lines.push(line('secret', s.name, s.key));
    if (c.secretsFile) lines.push(line('secrets', c.secretsFile));
    if (c.require) lines.push(line('require', ...c.require));
    if (c.requireOpcode) lines.push(line('require_opcode', ...c.requireOpcode));
    return formatDeclaration(this.name, c.zones, lines);
  }

  public static override parse(config: string): TsigPlugin {
    const plugin = new TsigPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    c.zones = args;
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'secret':
          if (values[0] && values[1]) c.secrets.push({ name: values[0], key: values[1] });
          break;
        case 'secrets':
          if (values[0]) c.secretsFile = values[0];
          break;
        case 'require':
          c.require = values;
          break;
        case 'require_opcode':
          c.requireOpcode = values;
          break;
      }
    }
    return plugin;
  }
}
