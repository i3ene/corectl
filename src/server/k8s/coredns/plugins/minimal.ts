import { IMinimal, IMinimalPlugin } from '../../../../shared/coredns/plugins/minimal';
import { Plugin } from '../plugin';

export class Minimal implements IMinimal {
  [key: string]: never;
}

export class MinimalPlugin extends Plugin<Minimal> implements IMinimalPlugin {
  public readonly name = 'minimal';
  public config: Minimal = new Minimal();

  public override toString(): string {
    return this.name;
  }

  public static override parse(_config: string): MinimalPlugin {
    return new MinimalPlugin();
  }
}
