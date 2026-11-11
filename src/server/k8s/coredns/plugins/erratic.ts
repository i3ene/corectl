import {
  IErratic,
  IErraticAmount,
  IErraticDelay,
  IErraticPlugin,
} from '../../../../shared/coredns/plugins/erratic';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Erratic implements IErratic {
  public drop?: IErraticAmount = undefined;
  public truncate?: IErraticAmount = undefined;
  public delay?: IErraticDelay = undefined;
}

export class ErraticPlugin extends Plugin<Erratic> implements IErraticPlugin {
  public readonly name = 'erratic';
  public config: Erratic = new Erratic();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.drop) lines.push(line('drop', c.drop.amount));
    if (c.truncate) lines.push(line('truncate', c.truncate.amount));
    if (c.delay) {
      // duration can only be given together with an amount
      lines.push(line('delay', c.delay.amount, c.delay.amount ? c.delay.duration : undefined));
    }
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): ErraticPlugin {
    const plugin = new ErraticPlugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [directive, ...values] of lines) {
      switch (directive) {
        case 'drop':
          plugin.config.drop = { amount: values[0] };
          break;
        case 'truncate':
          plugin.config.truncate = { amount: values[0] };
          break;
        case 'delay':
          plugin.config.delay = { amount: values[0], duration: values[1] };
          break;
      }
    }
    return plugin;
  }
}
