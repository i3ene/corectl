import { ACLAction, IACL, IACLPlugin, IACLRule } from '../../../../shared/coredns/plugins/acl';
import { ParseCorefile } from '../corefile';
import { Plugin } from '../plugin';

export class ACLRule implements IACLRule {
  public action: ACLAction = ACLAction.Allow;
  public network: string = '';
}

export class ACL implements IACL {
  public rules: ACLRule[] = [];
}

@ParseCorefile()
export class ACLPlugin extends Plugin<ACL> implements IACLPlugin {
  public readonly name = 'acl';
  public config: ACL = new ACL();

  public override toString(): string {
    const lines = this.config.rules.map((r) => `  ${r.action} ${r.network}`);
    return `${this.name} {\n${lines.join('\n')}\n}`;
  }

  public static parseCorefile(config: string): ACLPlugin {
    const plugin = new ACLPlugin();

    if (!config) return plugin;

    // If full plugin declaration provided like: "acl { ... }" - extract inner
    let inner = config.trim();
    const m = /^acl\s*\{([\s\S]*)\}$/.exec(inner);
    if (m) inner = m[1];

    // Remove comments and normalize lines
    const lines = inner
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map((l) => l.replace(/#.*/, '').replace(/;.*/, '').trim())
      .filter(Boolean);

    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length < 2) continue;
      const action = parts[0].toLowerCase();
      const network = parts[1];
      const rule = new ACLRule();
      if (action === 'allow') rule.action = ACLAction.Allow;
      else if (action === 'block' || action === 'deny') rule.action = ACLAction.Block;
      else continue;
      rule.network = network;
      plugin.config.rules.push(rule);
    }

    return plugin;
  }
}
