import { IErrors, IErrorsPlugin } from '../../../../shared/coredns/plugins/errors';
import { Plugin } from '../plugin';

export class Errors implements IErrors {
  // TODO
}

export class ErrorsPlugin extends Plugin<Errors> implements IErrorsPlugin {
  public readonly name = 'errors';
  public config: Errors = new Errors();

  public override toString(): string {
    return '';
  }

  public static override parse(config: string): ErrorsPlugin {
    // TODO
    return new ErrorsPlugin();
  }
}
