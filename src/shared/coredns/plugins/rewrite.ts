import { IPlugin } from '../plugin';

export type RewriteMode = 'continue' | 'stop';

export interface IRewrite {
  mode?: RewriteMode;
  /** `type`, `name`, `class`, `edns0`, `ttl`, `cname` or `rcode`. */
  field: string;
  /** Match type (`exact`, `prefix`, `suffix`, `substring`, `regex`) for `name`, `ttl` and `cname`. */
  type?: string;
  /** Remaining arguments: FROM/TO, TTL, EDNS0 options and `answer ...` options. */
  args: string[];
}

export interface IRewritePlugin extends IPlugin {
  name: 'rewrite';
  config: IRewrite;
}
