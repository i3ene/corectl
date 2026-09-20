import { ParsablePlugin } from '../plugin';
import { ACLPlugin } from './acl';
import { CachePlugin } from './cache';
import { ErrorsPlugin } from './errors';
import { ForwardPlugin } from './forward';
import { HealthPlugin } from './health';
import { HostsPlugin } from './hosts';
import { KubernetesPlugin } from './kubernetes';
import { LoadbalancePlugin } from './loadbalance';
import { LogPlugin } from './log';
import { LoopPlugin } from './loop';
import { PrometheusPlugin } from './prometheus';
import { ReadyPlugin } from './ready';
import { ReloadPlugin } from './reload';

const plugins: ParsablePlugin[] = [
  ACLPlugin,
  ErrorsPlugin,
  HealthPlugin,
  ReadyPlugin,
  ForwardPlugin,
  LogPlugin,
  KubernetesPlugin,
  PrometheusPlugin,
  HostsPlugin,
  CachePlugin,
  LoopPlugin,
  ReloadPlugin,
  LoadbalancePlugin,
];

export default plugins;
