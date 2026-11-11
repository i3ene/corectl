import { IPlugin } from '../plugin';

export interface ITransfer {
  zones: string[];
  /** Hosts to transfer to; `*` permits all. */
  to: string[];
  source?: string;
}

export interface ITransferPlugin extends IPlugin {
  name: 'transfer';
  config: ITransfer;
}
