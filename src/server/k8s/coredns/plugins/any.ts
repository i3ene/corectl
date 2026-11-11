import { IAny, IAnyPlugin } from '../../../../shared/coredns/plugins/any';
import { Plugin } from '../plugin';

export class Any implements IAny {}

export class AnyPlugin extends Plugin<Any> implements IAnyPlugin {
  public readonly name = 'any';
  public config: Any = new Any();

  public override toString(): string {
    return this.name;
  }

  public static override parse(_config: string): AnyPlugin {
    return new AnyPlugin();
  }
}
