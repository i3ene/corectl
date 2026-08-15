import { IZone } from '../../../shared/coredns/zone';
import { ACorefile, Corefile } from './corefile';
import { APlugin } from './plugin';

@Corefile()
export class Zone extends ACorefile implements IZone {
  public name: string = '';
  public plugins: APlugin<unknown>[] = [];

  public override toCorefile(): string {
    // TODO
    return '';
  }

  public static parseCorefile(config: string): Zone {
    // TODO
    return new Zone();
  }
}
