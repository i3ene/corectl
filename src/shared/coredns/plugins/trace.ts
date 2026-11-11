import { IPlugin } from '../plugin';

export type TraceEndpointType = 'zipkin' | 'datadog';

export interface ITrace {
  endpointType?: TraceEndpointType;
  endpoint?: string;
  every?: string;
  service?: string;
  clientServer: boolean;
  datadogAnalyticsRate?: string;
  zipkinMaxBacklogSize?: string;
  zipkinMaxBatchSize?: string;
  zipkinMaxBatchInterval?: string;
}

export interface ITracePlugin extends IPlugin {
  name: 'trace';
  config: ITrace;
}
