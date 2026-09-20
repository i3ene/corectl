import { ILoop, ILoopPlugin } from '../../../../shared/coredns/plugins/loop';
import { Plugin } from '../plugin';

export class Loop implements ILoop {}

export class LoopPlugin extends Plugin<Loop> implements ILoopPlugin {
  public readonly name = 'loop';
  public config: Loop = new Loop();

  public override toString(): string {
    return this.name;
  }

  public static override parse(config: string): LoopPlugin {
    const plugin = new LoopPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    if (declaration !== 'loop') return plugin;

    return plugin;
  }
}
