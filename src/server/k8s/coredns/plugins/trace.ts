import { ITrace, ITracePlugin, TraceEndpointType } from '../../../../shared/coredns/plugins/trace';
import { Plugin } from '../plugin';
import { formatDeclaration, line, parseDeclaration } from './util';

export class Trace implements ITrace {
  public endpointType?: TraceEndpointType = undefined;
  public endpoint?: string = undefined;
  public every?: string = undefined;
  public service?: string = undefined;
  public clientServer = false;
  public datadogAnalyticsRate?: string = undefined;
  public zipkinMaxBacklogSize?: string = undefined;
  public zipkinMaxBatchSize?: string = undefined;
  public zipkinMaxBatchInterval?: string = undefined;
}

export class TracePlugin extends Plugin<Trace> implements ITracePlugin {
  public readonly name = 'trace';
  public config: Trace = new Trace();

  public override toString(): string {
    const c = this.config;
    const lines: string[] = [];
    if (c.every) lines.push(line('every', c.every));
    if (c.service) lines.push(line('service', c.service));
    if (c.clientServer) lines.push('client_server');
    if (c.datadogAnalyticsRate) lines.push(line('datadog_analytics_rate', c.datadogAnalyticsRate));
    if (c.zipkinMaxBacklogSize) lines.push(line('zipkin_max_backlog_size', c.zipkinMaxBacklogSize));
    if (c.zipkinMaxBatchSize) lines.push(line('zipkin_max_batch_size', c.zipkinMaxBatchSize));
    if (c.zipkinMaxBatchInterval) {
      lines.push(line('zipkin_max_batch_interval', c.zipkinMaxBatchInterval));
    }
    return formatDeclaration(this.name, [c.endpointType ?? '', c.endpoint ?? ''], lines);
  }

  public static override parse(config: string): TracePlugin {
    const plugin = new TracePlugin();
    const { args, lines } = parseDeclaration(config, plugin.name);
    const c = plugin.config;
    if (args[0] === 'zipkin' || args[0] === 'datadog') {
      c.endpointType = args.shift() as TraceEndpointType;
    }
    c.endpoint = args[0];
    for (const [directive, value] of lines) {
      switch (directive) {
        case 'client_server':
          c.clientServer = true;
          break;
        case 'every':
          if (value) c.every = value;
          break;
        case 'service':
          if (value) c.service = value;
          break;
        case 'datadog_analytics_rate':
          if (value) c.datadogAnalyticsRate = value;
          break;
        case 'zipkin_max_backlog_size':
          if (value) c.zipkinMaxBacklogSize = value;
          break;
        case 'zipkin_max_batch_size':
          if (value) c.zipkinMaxBatchSize = value;
          break;
        case 'zipkin_max_batch_interval':
          if (value) c.zipkinMaxBatchInterval = value;
          break;
      }
    }
    return plugin;
  }
}
