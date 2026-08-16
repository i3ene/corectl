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
      const parser = getParser(name);
      if (!parser) return undefined;
      return parser(s);
    } catch (err) {
      return undefined;
    }
  }
}

export type PluginParser = (declaration: string) => Plugin<unknown> | undefined;

const parsers: Map<string, PluginParser> = new Map();

export function registerPlugin(name: string, parser: PluginParser) {
  parsers.set(name, parser);
}

export function getParser(name: string): PluginParser | undefined {
  return parsers.get(name);
}

export function listRegisteredPlugins(): string[] {
  return Array.from(parsers.keys());
}
