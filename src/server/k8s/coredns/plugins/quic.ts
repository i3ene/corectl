import { IQuic, IQuicPlugin } from '../../../../shared/coredns/plugins/quic';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Quic implements IQuic {
  public maxStreams?: string = undefined;
  public maxConnections?: string = undefined;
  public workerPoolSize?: string = undefined;
}

export class QuicPlugin extends Plugin<Quic> implements IQuicPlugin {
  public readonly name = 'quic';
  public config: Quic = new Quic();

  public override toString(): string {
    const lines: string[] = [];
    if (this.config.maxStreams) lines.push(line('max_streams', this.config.maxStreams));
    if (this.config.maxConnections) lines.push(line('max_connections', this.config.maxConnections));
    if (this.config.workerPoolSize) {
      lines.push(line('worker_pool_size', this.config.workerPoolSize));
    }
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): QuicPlugin {
    const plugin = new QuicPlugin();
    for (const tokens of parseDeclaration(config, plugin.name).lines) {
      if (tokens[1] === undefined) continue;
      switch (tokens[0]) {
        case 'max_streams':
          plugin.config.maxStreams = tokens[1];
          break;
        case 'max_connections':
          plugin.config.maxConnections = tokens[1];
          break;
        case 'worker_pool_size':
          plugin.config.workerPoolSize = tokens[1];
          break;
      }
    }
    return plugin;
  }
}
