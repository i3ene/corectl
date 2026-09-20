import { IReady, IReadyPlugin, ReadyMonitor } from '../../../../shared/coredns/plugins/ready';
import { Plugin } from '../plugin';

export class Ready implements IReady {
  public address?: string | undefined = undefined;
  public monitor?: ReadyMonitor | undefined = undefined;
}

export class ReadyPlugin extends Plugin<Ready> implements IReadyPlugin {
  public readonly name = 'ready';
  public config: Ready = new Ready();

  public override toString(): string {
    const address = this.config.address ? ` ${this.config.address}` : '';
    if (!this.config.monitor) return `${this.name}${address}`;

    return `${this.name}${address} {\n  monitor ${this.config.monitor}\n}`;
  }

  public static override parse(config: string): ReadyPlugin {
    const plugin = new ReadyPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const blockMatch = /^ready(?:\s+([^\s{}]+))?\s*\{([\s\S]*)\}$/.exec(declaration);

    if (blockMatch) {
      plugin.config.address = blockMatch[1];
      const monitorMatch = /^\s*monitor\s+(until-ready|continuously)\s*$/m.exec(blockMatch[2]);
      if (monitorMatch?.[1] === ReadyMonitor.UntilReady) {
        plugin.config.monitor = ReadyMonitor.UntilReady;
      } else if (monitorMatch?.[1] === ReadyMonitor.Continuously) {
        plugin.config.monitor = ReadyMonitor.Continuously;
      }
      return plugin;
    }

    const inlineMatch = /^ready(?:\s+([^\s{}]+))?$/.exec(declaration);
    if (inlineMatch) plugin.config.address = inlineMatch[1];

    return plugin;
  }
}
