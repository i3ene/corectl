import { IDebug, IDebugPlugin } from '../../../../shared/coredns/plugins/debug';
import { Plugin } from '../plugin';

export class Debug implements IDebug {}

export class DebugPlugin extends Plugin<Debug> implements IDebugPlugin {
  public readonly name = 'debug';
  public config: Debug = new Debug();

  public override toString(): string {
    return this.name;
  }

  public static override parse(_config: string): DebugPlugin {
    return new DebugPlugin();
  }
}
