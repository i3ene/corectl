import { IHealth, IHealthPlugin } from '../../../../shared/coredns/plugins/health';
import { Plugin } from '../plugin';

export class Health implements IHealth {
  public address: string = ':8080';
  public duration?: string | undefined = undefined;
}

export class HealthPlugin extends Plugin<Health> implements IHealthPlugin {
  public readonly name = 'health';
  public config: Health = new Health();

  public override toString(): string {
    // TODO
    return '';
  }

  public static override parse(config: string): HealthPlugin {
    // TODO
    return new HealthPlugin();
  }
}
