import { IPlugin } from '../plugin';

export interface ITimeouts {
  read?: string;
  write?: string;
  idle?: string;
  maxtcpqueries?: string;
}

export interface ITimeoutsPlugin extends IPlugin {
  name: 'timeouts';
  config: ITimeouts;
}
