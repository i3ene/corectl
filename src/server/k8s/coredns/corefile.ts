import { Constructor } from '../../../shared/type';

export function ParseCorefile<T>() {
  return function <U extends ICorefile<T>>(constructor: U): U {
    import('./plugin').then((module) => {
      const instance = new constructor();
      if (instance instanceof module.Plugin) {
        const parser = (declaration: string) => {
          const result = constructor.parseCorefile(declaration);
          return result instanceof module.Plugin ? result : undefined;
        };
        module.Registry.register(instance.name, parser);
      }
    });
    return constructor;
  };
}

export interface ICorefile<T> extends Constructor<T> {
  parseCorefile(decleration: string): InstanceType<this>;
}

export abstract class Corefile extends Object {
  public abstract override toString(): string;
}
