import { ITransfer, ITransferPlugin } from '../../../../shared/coredns/plugins/transfer';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Transfer implements ITransfer {
  public zones: string[] = [];
  public to: string[] = [];
  public source?: string = undefined;
}

export class TransferPlugin extends Plugin<Transfer> implements ITransferPlugin {
  public readonly name = 'transfer';
  public config: Transfer = new Transfer();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.to.length) lines.push(line('to', ...this.config.to));
    if (this.config.source) lines.push(line('source', this.config.source));
    return formatDeclaration(this.name, this.config.zones, lines);
  }

  public static override parse(config: string): TransferPlugin {
    const plugin = new TransferPlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    plugin.config.zones = args;
    for (const [directive, ...values] of lines) {
      if (directive === 'to') plugin.config.to.push(...values);
      else if (directive === 'source' && values[0]) plugin.config.source = values[0];
    }
    return plugin;
  }
}
