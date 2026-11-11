import { IWhoami, IWhoamiPlugin } from '../../../../shared/coredns/plugins/whoami';
import { Plugin } from '../plugin';

export class Whoami implements IWhoami {
  [key: string]: never;
}

export class WhoamiPlugin extends Plugin<Whoami> implements IWhoamiPlugin {
  public readonly name = 'whoami';
  public config: Whoami = new Whoami();

  public override toString(): string {
    return this.name;
  }

  public static override parse(_config: string): WhoamiPlugin {
    return new WhoamiPlugin();
  }
}
