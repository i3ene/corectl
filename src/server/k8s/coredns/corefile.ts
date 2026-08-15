import { Constructor } from '../../../shared/type';

export function Corefile<T, A extends unknown[]>() {
  return function <U extends ICorefile<T, A>>(constructor: U): U {
    return constructor;
  };
}

export interface ICorefile<T, A extends unknown[] = [string]> extends Constructor<T> {
  parseCorefile(...args: A): InstanceType<this>;
}

export abstract class ACorefile {
  public abstract toCorefile(): string;
}
