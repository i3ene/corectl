import { IConfig } from '../../../shared/coredns/config';
import { ACorefile } from './corefile';

export class Config extends ACorefile implements IConfig {
  public override toCorefile(): string {
    // TODO
    return '';
  }
}
