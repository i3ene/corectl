import { IConfig } from '../../../shared/coredns/config';
import { Corefile } from './corefile';

export class Config extends Corefile implements IConfig {
  public override toString(): string {
    // TODO
    return '';
  }
}
