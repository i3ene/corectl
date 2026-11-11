export interface ParsedDeclaration {
  /** Tokens following the plugin name on the declaration line. */
  args: string[];
  /** Whether the declaration contained a `{ ... }` block. */
  hasBlock: boolean;
  /** Tokenized lines of the block body; nested braces appear as `{` / `}` tokens. */
  lines: string[][];
}

/** Splits a line into tokens, keeping quoted strings together (quotes removed) and `{` / `}` as own tokens. */
export function tokenize(line: string): string[] {
  const tokens: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([{}])|([^\s{}"']+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) tokens.push(m[1] ?? m[2] ?? m[3] ?? m[4]);
  return tokens;
}

/** Quotes a token when it contains whitespace or is empty. */
export function quote(token: string): string {
  return token === '' || /[\s{}]/.test(token) ? `"${token.replace(/"/g, '\\"')}"` : token;
}

/** Parses `name args... [{ body }]` into header arguments and tokenized body lines. */
export function parseDeclaration(config: string, name: string): ParsedDeclaration {
  const result: ParsedDeclaration = { args: [], hasBlock: false, lines: [] };
  const declaration = (config ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/(^|\s)#.*/g, '$1')
    .trim();
  if (!new RegExp(`^${name}(?:\\s|\\{|$)`).test(declaration)) return result;

  const rest = declaration.slice(name.length);
  const openBrace = rest.indexOf('{');
  const closeBrace = rest.lastIndexOf('}');
  const headerEnd = openBrace === -1 ? rest.length : openBrace;
  result.args = tokenize(rest.slice(0, headerEnd).replace(/\n/g, ' '));
  if (openBrace === -1 || closeBrace < openBrace) return result;

  result.hasBlock = true;
  result.lines = rest
    .slice(openBrace + 1, closeBrace)
    .split('\n')
    .map((l) => tokenize(l))
    .filter((t) => t.length);
  return result;
}

/** Splits text on whitespace, keeping quoted strings together (quotes removed); braces are left intact. */
export function splitArgs(text: string): string[] {
  const tokens: string[] = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) tokens.push(m[1] ?? m[2] ?? m[3]);
  return tokens;
}

export interface RawDirective {
  directive: string;
  /** Remaining text of the line, untouched (quotes and braces preserved). */
  rest: string;
}

/**
 * Like `parseDeclaration`, but body lines are kept as raw text, so values containing braces
 * (templates, regular expressions, expressions) survive. The header must not contain braces.
 */
export function parseRawDeclaration(
  config: string,
  name: string,
): { args: string[]; hasBlock: boolean; lines: RawDirective[] } {
  const result = { args: [] as string[], hasBlock: false, lines: [] as RawDirective[] };
  const declaration = (config ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/(^|\s)#.*/g, '$1')
    .trim();
  if (!new RegExp(`^${name}(?:\\s|\\{|$)`).test(declaration)) return result;

  const rest = declaration.slice(name.length);
  const openBrace = rest.indexOf('{');
  const closeBrace = rest.lastIndexOf('}');
  result.args = splitArgs(rest.slice(0, openBrace === -1 ? rest.length : openBrace));
  if (openBrace === -1 || closeBrace < openBrace) return result;

  result.hasBlock = true;
  for (const raw of rest.slice(openBrace + 1, closeBrace).split('\n')) {
    const text = raw.trim();
    if (!text) continue;
    const m = /^(\S+)\s*([\s\S]*)$/.exec(text)!;
    result.lines.push({ directive: m[1], rest: m[2].trim() });
  }
  return result;
}

/** Formats `name args... [{ lines }]` using two-space indentation. */
export function formatDeclaration(name: string, args: string[], lines: string[]): string {
  const header = [name, ...args.filter((a) => a !== undefined && a !== '').map(quote)].join(' ');
  if (!lines.length) return header;
  return `${header} {\n${lines.map((l) => `  ${l}`).join('\n')}\n}`;
}

/** Joins tokens into a single line, quoting where required and skipping empty values. */
export function line(...tokens: (string | undefined)[]): string {
  return tokens
    .filter((t): t is string => t !== undefined && t !== '')
    .map(quote)
    .join(' ');
}
