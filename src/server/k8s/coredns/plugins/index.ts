import { ParsablePlugin } from '../plugin';
import { ACLPlugin } from './acl';
import { ErrorsPlugin } from './errors';
import { ForwardPlugin } from './forward';
import { HealthPlugin } from './health';
import { KubernetesPlugin } from './kubernetes';
import { LogPlugin } from './log';
import { ReadyPlugin } from './ready';

const plugins: ParsablePlugin[] = [
  ACLPlugin,
  ErrorsPlugin,
  HealthPlugin,
  ReadyPlugin,
  ForwardPlugin,
  LogPlugin,
  KubernetesPlugin,
];

export default plugins;
