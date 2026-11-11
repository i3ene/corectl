import {
  ITemplate,
  ITemplateEdnsError,
  ITemplatePlugin,
  ITemplateVar,
} from '../../../../shared/coredns/plugins/template';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseRawDeclaration, quote, splitArgs } from './util';

export class Template implements ITemplate {
  public queryClass?: string = undefined;
  public queryType?: string = undefined;
  public zones: string[] = [];
  public match: string[] = [];
  public vars: ITemplateVar[] = [];
  public expr: string[] = [];
  public answer: string[] = [];
  public additional: string[] = [];
  public authority: string[] = [];
  public rcode?: string = undefined;
  public ederror?: ITemplateEdnsError = undefined;
  public fallthrough?: string[] = undefined;
}

export class TemplatePlugin extends Plugin<Template> implements ITemplatePlugin {
  public readonly name = 'template';
  public config: Template = new Template();

  // Template bodies, expressions and records are stored as raw text so braces and quotes survive.
  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.match.length) lines.push(line('match', ...c.match));
    for (const v of c.vars) lines.push(`var ${quote(v.name)} ${v.expression}`);
    for (const e of c.expr) lines.push(`expr ${e}`);
    for (const a of c.answer) lines.push(`answer ${a}`);
    for (const a of c.additional) lines.push(`additional ${a}`);
    for (const a of c.authority) lines.push(`authority ${a}`);
    if (c.rcode) lines.push(line('rcode', c.rcode));
    if (c.ederror) lines.push(line('ederror', c.ederror.code, c.ederror.reason));
    if (c.fallthrough) lines.push(line('fallthrough', ...c.fallthrough));
    return formatDeclaration(this.name, [c.queryClass ?? '', c.queryType ?? '', ...c.zones], lines);
  }

  public static override parse(config: string): TemplatePlugin {
    const plugin = new TemplatePlugin();
    const { args, lines } = parseRawDeclaration(config, plugin.name);
    const c = plugin.config;
    [c.queryClass, c.queryType] = args;
    c.zones = args.slice(2);
    for (const { directive, rest } of lines) {
      switch (directive) {
        case 'match':
          c.match.push(...splitArgs(rest));
          break;
        case 'var': {
          const m = /^(\S+)\s+([\s\S]+)$/.exec(rest);
          if (m) c.vars.push({ name: m[1], expression: m[2] });
          break;
        }
        case 'expr':
          if (rest) c.expr.push(rest);
          break;
        case 'answer':
          c.answer.push(rest);
          break;
        case 'additional':
          c.additional.push(rest);
          break;
        case 'authority':
          c.authority.push(rest);
          break;
        case 'rcode':
          if (rest) c.rcode = rest;
          break;
        case 'ederror': {
          const m = /^(\S+)(?:\s+([\s\S]+))?$/.exec(rest);
          if (m) c.ederror = { code: m[1], reason: m[2] ? splitArgs(m[2]).join(' ') : undefined };
          break;
        }
        case 'fallthrough':
          c.fallthrough = splitArgs(rest);
          break;
      }
    }
    return plugin;
  }
}
