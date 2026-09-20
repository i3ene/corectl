import { IPrometheus, IPrometheusPlugin } from '../../../../shared/coredns/plugins/prometheus';
import { Plugin } from '../plugin';

export class Prometheus implements IPrometheus {
  public address?: string = undefined;
  public runtimeMetrics = false;
}

export class PrometheusPlugin extends Plugin<Prometheus> implements IPrometheusPlugin {
  public readonly name = 'prometheus';
  public config: Prometheus = new Prometheus();

  public override toString(): string {
    const address = this.config.address ? ` ${this.config.address}` : '';
    if (!this.config.runtimeMetrics) return `${this.name}${address}`;

    return `${this.name}${address} {\n  runtime_metrics\n}`;
  }

  public static override parse(config: string): PrometheusPlugin {
    const plugin = new PrometheusPlugin();
    if (!config) return plugin;

    const declaration = config
      .replace(/\r\n?/g, '\n')
      .replace(/#.*/g, '')
      .replace(/;/g, '\n')
      .trim();
    const blockMatch = /^prometheus(?:\s+([^\s{}]+))?\s*\{([\s\S]*)\}$/.exec(declaration);

    if (blockMatch) {
      plugin.config.address = blockMatch[1];
      plugin.config.runtimeMetrics = /^\s*runtime_metrics\s*$/m.test(blockMatch[2]);
      return plugin;
    }

    const inlineMatch = /^prometheus(?:\s+([^\s{}]+))?$/.exec(declaration);
    if (inlineMatch) plugin.config.address = inlineMatch[1];

    return plugin;
  }
}
