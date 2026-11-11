import { ITimeouts, ITimeoutsPlugin } from '../../../../shared/coredns/plugins/timeouts';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Timeouts implements ITimeouts {
  public read?: string = undefined;
  public write?: string = undefined;
  public idle?: string = undefined;
  public maxtcpqueries?: string = undefined;
}

export class TimeoutsPlugin extends Plugin<Timeouts> implements ITimeoutsPlugin {
  public readonly name = 'timeouts';
  public config: Timeouts = new Timeouts();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.read) lines.push(line('read', c.read));
    if (c.write) lines.push(line('write', c.write));
    if (c.idle) lines.push(line('idle', c.idle));
    if (c.maxtcpqueries) lines.push(line('maxtcpqueries', c.maxtcpqueries));
    return formatDeclaration(this.name, [], lines);
  }

  public static override parse(config: string): TimeoutsPlugin {
    const plugin = new TimeoutsPlugin();
    const { lines } = parseDeclaration(config, plugin.name);
    for (const [directive, value] of lines) {
      if (!value) continue;
      switch (directive) {
        case 'read':
        case 'write':
        case 'idle':
        case 'maxtcpqueries':
          plugin.config[directive] = value;
          break;
      }
    }
    return plugin;
  }
}
