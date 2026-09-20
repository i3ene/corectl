import {
  ICache,
  ICacheDisable,
  ICachePlugin,
  ICachePolicy,
  ICachePrefetch,
  ICacheServeStale,
} from '../../../../shared/coredns/plugins/cache';
import { Plugin } from '../plugin';

export class Cache implements ICache {
  public ttl?: string = undefined;
  public zones: string[] = [];
  public success?: ICachePolicy = undefined;
  public denial?: ICachePolicy = undefined;
  public prefetch?: ICachePrefetch = undefined;
  public serveStale?: ICacheServeStale = undefined;
  public servfail?: string = undefined;
  public disable: ICacheDisable[] = [];
  public keepttl = false;
}

export class CachePlugin extends Plugin<Cache> implements ICachePlugin {
  public readonly name = 'cache';
  public config: Cache = new Cache();

  public override toString(): string {
    const header = [this.config.ttl, ...this.config.zones].filter(Boolean).join(' ');
    const lines: string[] = [];
    if (this.config.success) lines.push(this.formatPolicy('success', this.config.success));
    if (this.config.denial) lines.push(this.formatPolicy('denial', this.config.denial));
    if (this.config.prefetch) {
      const { amount, duration, percentage } = this.config.prefetch;
      lines.push(`prefetch ${[amount, duration, percentage].filter(Boolean).join(' ')}`);
    }
    if (this.config.serveStale) {
      const { duration, refreshMode, verifyTimeout } = this.config.serveStale;
      lines.push(
        `serve_stale ${[duration, refreshMode, verifyTimeout].filter(Boolean).join(' ')}`.trim(),
      );
    }
    if (this.config.servfail) lines.push(`servfail ${this.config.servfail}`);
    for (const disable of this.config.disable) {
      lines.push(
        `disable ${disable.type}${disable.zones.length ? ` ${disable.zones.join(' ')}` : ''}`,
      );
    }
    if (this.config.keepttl) lines.push('keepttl');

    if (!lines.length) return `${this.name}${header ? ` ${header}` : ''}`;
    return `${this.name}${header ? ` ${header}` : ''} {\n${lines.map((line) => `  ${line}`).join('\n')}\n}`;
  }

  private formatPolicy(name: string, policy: ICachePolicy): string {
    return `${name} ${[policy.capacity, policy.ttl, policy.minTtl].filter(Boolean).join(' ')}`;
  }

  public static override parse(config: string): CachePlugin {
    const plugin = new CachePlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const openBrace = declaration.indexOf('{');
    const closeBrace = declaration.lastIndexOf('}');
    const hasBlock =
      /^cache(?:\s|\{|$)/.test(declaration) &&
      openBrace !== -1 &&
      closeBrace > openBrace &&
      !declaration.slice(closeBrace + 1).trim();

    const header = hasBlock
      ? declaration.slice('cache'.length, openBrace).trim()
      : declaration.slice('cache'.length).trim();
    if (header) {
      const args = header.split(/\s+/);
      plugin.config.ttl = args[0];
      plugin.config.zones = args.slice(1);
    }
    if (!hasBlock) return plugin;

    const lines = declaration
      .slice(openBrace + 1, closeBrace)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    for (const line of lines) {
      const parts = line.split(/\s+/);
      const directive = parts[0];
      const values = parts.slice(1);
      switch (directive) {
        case 'success':
          plugin.config.success = this.parsePolicy(values);
          break;
        case 'denial':
          plugin.config.denial = this.parsePolicy(values);
          break;
        case 'prefetch':
          if (values[0]) {
            plugin.config.prefetch = {
              amount: values[0],
              duration: values[1],
              percentage: values[2],
            };
          }
          break;
        case 'serve_stale':
          plugin.config.serveStale = {
            duration: values[0],
            refreshMode: values[1],
            verifyTimeout: values[2],
          };
          break;
        case 'servfail':
          if (values[0]) plugin.config.servfail = values[0];
          break;
        case 'disable':
          if (values[0] === 'success' || values[0] === 'denial') {
            plugin.config.disable.push({ type: values[0], zones: values.slice(1) });
          }
          break;
        case 'keepttl':
          plugin.config.keepttl = true;
          break;
      }
    }

    return plugin;
  }

  private static parsePolicy(values: string[]): ICachePolicy | undefined {
    if (!values[0]) return undefined;
    return { capacity: values[0], ttl: values[1], minTtl: values[2] };
  }
}
