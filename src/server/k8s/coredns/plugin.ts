import { IPlugin } from '../../../shared/coredns/plugin';
import { ACorefile } from './corefile';

export abstract class APlugin<T> extends ACorefile implements IPlugin {
  public abstract readonly name: string;
  public abstract config: T;
}
