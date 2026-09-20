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
    // TODO
    return '';
  }

  public static override parse(config: string): ReadyPlugin {
    // TODO
    return new ReadyPlugin();
  }
}
