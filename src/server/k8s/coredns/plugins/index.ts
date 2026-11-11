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
import { AnyPlugin } from './any';
import { AutoPlugin } from './auto';
import { AutopathPlugin } from './autopath';
import { AzurePlugin } from './azure';
import { BindPlugin } from './bind';
import { BufsizePlugin } from './bufsize';
import { CancelPlugin } from './cancel';
import { ChaosPlugin } from './chaos';
import { ClouddnsPlugin } from './clouddns';
import { DebugPlugin } from './debug';
import { Dns64Plugin } from './dns64';
import { DnssecPlugin } from './dnssec';
import { DnstapPlugin } from './dnstap';
import { ErraticPlugin } from './erratic';
import { EtcdPlugin } from './etcd';
import { FilePlugin } from './file';
import { GeoipPlugin } from './geoip';
import { GrpcPlugin } from './grpc';
import { GrpcServerPlugin } from './grpc_server';
import { HeaderPlugin } from './header';
import { HttpsPlugin } from './https';
import { Https3Plugin } from './https3';
import { ImportPlugin } from './import';
import { K8sExternalPlugin } from './k8s_external';
import { LocalPlugin } from './local';
import { MetadataPlugin } from './metadata';
import { MinimalPlugin } from './minimal';
import { MultisocketPlugin } from './multisocket';
import { NomadPlugin } from './nomad';
import { NsidPlugin } from './nsid';
import { PprofPlugin } from './pprof';
import { ProxyprotoPlugin } from './proxyproto';
import { QuicPlugin } from './quic';
import { RewritePlugin } from './rewrite';
import { RootPlugin } from './root';
import { Route53Plugin } from './route53';
import { SecondaryPlugin } from './secondary';
import { SignPlugin } from './sign';
import { TemplatePlugin } from './template';
import { TimeoutsPlugin } from './timeouts';
import { TlsPlugin } from './tls';
import { TracePlugin } from './trace';
import { TransferPlugin } from './transfer';
import { TsigPlugin } from './tsig';
import { ViewPlugin } from './view';
import { WhoamiPlugin } from './whoami';

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
  AnyPlugin,
  AutoPlugin,
  AutopathPlugin,
  AzurePlugin,
  BindPlugin,
  BufsizePlugin,
  CancelPlugin,
  ChaosPlugin,
  ClouddnsPlugin,
  DebugPlugin,
  Dns64Plugin,
  DnssecPlugin,
  DnstapPlugin,
  ErraticPlugin,
  EtcdPlugin,
  FilePlugin,
  GeoipPlugin,
  GrpcPlugin,
  GrpcServerPlugin,
  HeaderPlugin,
  ImportPlugin,
  HttpsPlugin,
  K8sExternalPlugin,
  Https3Plugin,
  MetadataPlugin,
  NsidPlugin,
  LocalPlugin,
  MinimalPlugin,
  PprofPlugin,
  MultisocketPlugin,
  NomadPlugin,
  QuicPlugin,
  RootPlugin,
  Route53Plugin,
  SignPlugin,
  ProxyprotoPlugin,
  WhoamiPlugin,
  RewritePlugin,
  SecondaryPlugin,
  TemplatePlugin,
  TimeoutsPlugin,
  TlsPlugin,
  TracePlugin,
  TransferPlugin,
  TsigPlugin,
  ViewPlugin,
];

export default plugins;
