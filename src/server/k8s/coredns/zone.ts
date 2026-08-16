import { IZone } from '../../../shared/coredns/zone';
import { Corefile, ParseCorefile } from './corefile';
import { Plugin } from './plugin';

@ParseCorefile()
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

  public static parseCorefile(config: string): Zone {
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
      const m = /^([a-zA-Z0-9_-]+)/.exec(inner.slice(i));
      if (!m) break;
      const pluginName = m[1];
      i += m[0].length;
      while (i < inner.length && /\s/.test(inner[i])) i++;
      if (inner[i] === '{') {
        let d = 0;
        let e = -1;
        for (let j = i; j < inner.length; j++) {
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
        const blockStart = i - pluginName.length;
        const block = inner.slice(blockStart, e + 1).trim();
        const parsed = Plugin.parsePlugin(block);
        if (parsed) zone.plugins.push(parsed);
        i = e + 1;
      } else {
        const rest = inner.slice(i);
        const nl = rest.search(/\n/);
        const line = nl === -1 ? rest.trim() : rest.slice(0, nl).trim();
        const decl = `${pluginName} ${line}`.trim();
        const parsed = Plugin.parsePlugin(decl);
        if (parsed) zone.plugins.push(parsed);
        i += (nl === -1 ? rest.length : nl) + 1;
      }
    }

    return zone;
  }
}
