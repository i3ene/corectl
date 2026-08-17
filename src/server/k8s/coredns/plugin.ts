import { IPlugin } from '../../../shared/coredns/plugin';
import { Corefile } from './corefile';

export abstract class Plugin<T> extends Corefile implements IPlugin {
  public abstract readonly name: string;
  public abstract config: T;

  public static parsePlugin(declaration: string): Plugin<unknown> | undefined {
    if (!declaration) return undefined;
    const s = declaration.trim();
    const nameMatch = /^([a-zA-Z0-9_-]+)/.exec(s);
    if (!nameMatch) return undefined;
    const name = nameMatch[1];
    try {
      const parser = Registry.get(name);
      if (!parser) return undefined;
      return parser(s);
    } catch (err) {
      return undefined;
    }
  }
}

export type PluginParser = (declaration: string) => Plugin<unknown> | undefined;

class PluginRegistry {
  private parsers: Map<string, PluginParser> = new Map();

  public register(name: string, parser: PluginParser) {
    this.parsers.set(name, parser);
  }

  public get(name: string): PluginParser | undefined {
    return this.parsers.get(name);
  }

  public list(): string[] {
    return Array.from(this.parsers.keys());
  }

  public clear() {
    this.parsers.clear();
  }
}

export const Registry = new PluginRegistry();
