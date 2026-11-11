import { IRewrite, IRewritePlugin, RewriteMode } from '../../../../shared/coredns/plugins/rewrite';
import { Plugin } from '../plugin';
import { formatDeclaration, splitArgs } from './util';

const MATCH_TYPES = ['exact', 'prefix', 'suffix', 'substring', 'regex'];
const TYPED_FIELDS = ['name', 'ttl', 'cname'];

export class Rewrite implements IRewrite {
  public mode?: RewriteMode = undefined;
  public field = '';
  public type?: string = undefined;
  public args: string[] = [];
}

export class RewritePlugin extends Plugin<Rewrite> implements IRewritePlugin {
  public readonly name = 'rewrite';
  public config: Rewrite = new Rewrite();

  public override toString(): string {
    const c = this.config;
    return formatDeclaration(
      this.name,
      [c.mode ?? '', c.field, c.type ?? '', ...c.args].filter((a) => a !== ''),
      [],
    );
  }

  public static override parse(config: string): RewritePlugin {
    const plugin = new RewritePlugin();
    const text = (config ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/(^|\s)#.*/g, '$1')
      .trim();
    if (!/^rewrite(?:\s|$)/.test(text)) return plugin;

    const tokens = splitArgs(text.slice('rewrite'.length));
    if (tokens[0] === 'continue' || tokens[0] === 'stop')
      plugin.config.mode = tokens.shift() as RewriteMode;
    if (!tokens.length) return plugin;

    plugin.config.field = tokens.shift()!;
    if (
      TYPED_FIELDS.includes(plugin.config.field) &&
      tokens[0] &&
      MATCH_TYPES.includes(tokens[0])
    ) {
      plugin.config.type = tokens.shift();
    }
    plugin.config.args = tokens;
    return plugin;
  }
}
