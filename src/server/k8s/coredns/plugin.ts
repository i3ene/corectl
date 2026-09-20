import { IPlugin } from '../../../shared/coredns/plugin';
import { Corefile } from './corefile';

export const PluginRegistry = new Map<string, ParsablePlugin>();
export type ParsablePlugin<T extends Plugin<unknown> = Plugin<unknown>> = {
  new (...args: any[]): T;
  parse(input: string): T;
};

export abstract class Plugin<T> extends Corefile implements IPlugin {
  public abstract readonly name: string;
  public abstract config: T;

  public static parse(declaration: string): Plugin<unknown> | undefined {
    if (!declaration) return undefined;
    const s = declaration.trim();
    const nameMatch = /^([a-zA-Z0-9_-]+)/.exec(s);
    if (!nameMatch) return undefined;
    const name = nameMatch[1];
    try {
      const plugin = PluginRegistry.get(name);
      if (!plugin) return undefined;
      return plugin.parse(s);
    } catch (err) {
      return undefined;
    }
  }
}

import('./plugins').then((plugins) =>
  plugins.default.forEach((plugin) => {
    PluginRegistry.set(new plugin().name, plugin);
  }),
);
