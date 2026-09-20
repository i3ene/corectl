import { ILog, ILogPlugin } from '../../../../shared/coredns/plugins/log';
import { Plugin } from '../plugin';

export class Log implements ILog {
  // TODO
}

export class LogPlugin extends Plugin<Log> implements ILogPlugin {
  public readonly name = 'log';
  public config: Log = new Log();

  public override toString(): string {
    // TODO
    return '';
  }

  public static override parse(config: string): LogPlugin {
    // TODO
    return new LogPlugin();
  }
}
