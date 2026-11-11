import { IView, IViewPlugin } from '../../../../shared/coredns/plugins/view';
import { Plugin } from '../plugin';
import { formatDeclaration, parseRawDeclaration } from './util';

export class View implements IView {
  public name?: string = undefined;
  public expr: string[] = [];
}

export class ViewPlugin extends Plugin<View> implements IViewPlugin {
  public readonly name = 'view';
  public config: View = new View();

  // Expressions are stored as raw text so quotes and braces survive.
  public override toString(): string {
    return formatDeclaration(
      this.name,
      [this.config.name ?? ''],
      this.config.expr.map((e) => `expr ${e}`),
    );
  }

  public static override parse(config: string): ViewPlugin {
    const plugin = new ViewPlugin();
    const { args, lines } = parseRawDeclaration(config, plugin.name);
    plugin.config.name = args[0];
    for (const { directive, rest } of lines) {
      if (directive === 'expr' && rest) plugin.config.expr.push(rest);
    }
    return plugin;
  }
}
