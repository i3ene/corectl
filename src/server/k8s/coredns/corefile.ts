import { ICorefile } from '../../../shared/coredns/corefile';
import { Config } from './config';
import { ServerBlock } from './server-block';

export class Corefile extends Config implements ICorefile {
  public serverBlocks: ServerBlock[] = [];

  public override toString(): string {
    return this.serverBlocks
      .map((z) => z.toString())
      .filter(Boolean)
      .join('\n\n');
  }

  public static parse(config: string): Corefile {
    const c = new Corefile();
    if (!config) return c;
    const s = config.replace(/\r\n?/g, '\n');
    let i = 0;
    const len = s.length;
    while (i < len) {
      while (i < len && /\s/.test(s[i])) i++;
      if (i >= len) break;
      const nameMatch = /^([^\s\{]+)/.exec(s.slice(i));
      if (!nameMatch) break;
      const start = i;
      i += nameMatch[0].length;
      while (i < len && /\s/.test(s[i])) i++;
      if (i < len && s[i] === '{') {
        let depth = 0;
        let end = -1;
        for (let j = i; j < len; j++) {
          if (s[j] === '{') depth++;
          else if (s[j] === '}') {
            depth--;
            if (depth === 0) {
              end = j;
              break;
            }
          }
        }
        if (end === -1) {
          const chunk = s.slice(start).trim();
          c.serverBlocks.push(ServerBlock.parse(chunk));
          break;
        }
        const chunk = s.slice(start, end + 1).trim();
        c.serverBlocks.push(ServerBlock.parse(chunk));
        i = end + 1;
      } else {
        const nl = s.indexOf('\n', i);
        const end = nl === -1 ? len : nl;
        const chunk = s.slice(start, end).trim();
        c.serverBlocks.push(ServerBlock.parse(chunk));
        i = end + 1;
      }
    }
    return c;
  }
}
