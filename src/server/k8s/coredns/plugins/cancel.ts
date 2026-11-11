import { ICancel, ICancelPlugin } from '../../../../shared/coredns/plugins/cancel';
import { Plugin } from '../plugin';
import { formatDeclaration, parseDeclaration } from './util';

export class Cancel implements ICancel {
  public timeout?: string = undefined;
}

export class CancelPlugin extends Plugin<Cancel> implements ICancelPlugin {
  public readonly name = 'cancel';
  public config: Cancel = new Cancel();

  public override toString(): string {
    return formatDeclaration(this.name, [this.config.timeout ?? ''], []);
  }

  public static override parse(config: string): CancelPlugin {
    const plugin = new CancelPlugin();
    const { args } = parseDeclaration(config, plugin.name);
    if (args[0]) plugin.config.timeout = args[0];
    return plugin;
  }
}
