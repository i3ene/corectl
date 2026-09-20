import { IZone } from '../../../shared/coredns/zone';
import { Corefile } from './corefile';
import { Plugin } from './plugin';

export class Zone extends Corefile implements IZone {
  public name: string = '';
  public plugins: Plugin<unknown>[] = [];

  public override toString(): string {
    const plugins = this.plugins
      .map((p) => p.toString())
      .filter(Boolean)
      .join('\n');
    return `${this.name} {\n${plugins}\n}`.trim();
  }

  public static parse(config: string): Zone {
    const zone = new Zone();
    if (!config) return zone;
    const cleaned = config
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map((l) => l.replace(/#.*/, '').replace(/;.*/, '').trim())
      .filter(Boolean)
      .join('\n');
    const firstBrace = cleaned.indexOf('{');
    if (firstBrace === -1) {
      zone.name = cleaned.trim();
      return zone;
    }
    zone.name = cleaned.slice(0, firstBrace).trim();
    let depth = 0;
    let start = -1;
    let end = -1;
    for (let i = firstBrace; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (ch === '{') {
        if (depth === 0) start = i + 1;
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (start === -1 || end === -1) return zone;
    const inner = cleaned.slice(start, end).trim();
    let i = 0;
    while (i < inner.length) {
      if (/\s/.test(inner[i])) {
        i++;
        continue;
      }
      const nameStart = i;
      const m = /^([a-zA-Z0-9_-]+)/.exec(inner.slice(i));
      if (!m) break;
      const pluginName = m[1];
      i += m[0].length;
      // Only skip spaces and tabs here so we don't cross line boundaries.
      while (i < inner.length && /[ \t]/.test(inner[i])) i++;
      const remainder = inner.slice(i);
      const nextNewline = remainder.search(/\n/);
      const nextBrace = remainder.indexOf('{');
      const hasBlock =
        inner[i] === '{' || (nextBrace !== -1 && (nextNewline === -1 || nextBrace < nextNewline));
      if (hasBlock) {
        const braceIndex = inner[i] === '{' ? i : i + nextBrace;
        let d = 0;
        let e = -1;
        for (let j = braceIndex; j < inner.length; j++) {
          if (inner[j] === '{') d++;
          else if (inner[j] === '}') {
            d--;
            if (d === 0) {
              e = j;
              break;
            }
          }
        }
        if (e === -1) break;
        const blockStart = nameStart;
        const block = inner.slice(blockStart, e + 1).trim();
        const parsed = Plugin.parse(block);
        if (parsed) zone.plugins.push(parsed);
        i = e + 1;
      } else {
        const rest = inner.slice(i);
        const nl = rest.search(/\n/);
        const line = nl === -1 ? rest.trim() : rest.slice(0, nl).trim();
        const decl = `${pluginName} ${line}`.trim();
        const parsed = Plugin.parse(decl);
        if (parsed) zone.plugins.push(parsed);
        i += (nl === -1 ? rest.length : nl) + 1;
      }
    }

    return zone;
  }
}
