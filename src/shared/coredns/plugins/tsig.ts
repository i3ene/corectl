import { IPlugin } from '../plugin';

export interface ITsigSecret {
  name: string;
  key: string;
}

export interface ITsig {
  zones: string[];
  secrets: ITsigSecret[];
  secretsFile?: string;
  /** Query types that must be signed; `all` or `none` are valid values. */
  require?: string[];
  /** Opcodes that must be signed; `all` or `none` are valid values. */
  requireOpcode?: string[];
}

export interface ITsigPlugin extends IPlugin {
  name: 'tsig';
  config: ITsig;
}
