import { ACLAction, IACL, IACLPlugin, IACLRule } from '../../../../shared/coredns/plugins/acl';
import { Corefile } from '../corefile';
import { APlugin } from '../plugin';

export class ACLRule implements IACLRule {
  public action: ACLAction = ACLAction.Allow;
  public network: string = '';
}

export class ACL implements IACL {
  public rules: ACLRule[] = [];
}

@Corefile()
export class ACLPlugin extends APlugin<ACL> implements IACLPlugin {
  public readonly name = 'acl';
  public config: ACL = new ACL();

  public override toCorefile(): string {
    // TODO
    return '';
  }

  public static parseCorefile(config: string): ACLPlugin {
    // TODO
    return new ACLPlugin();
  }
}
