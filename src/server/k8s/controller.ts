import { Request, Response } from 'express';
import { k8sApi } from './connection';
import { Config } from './coredns/config';

export async function getZones(req: Request, res: Response): Promise<void> {
  const configMap = await k8sApi.readNamespacedConfigMap({
    name: 'coredns',
    namespace: 'kube-system',
  });
  const corefile = configMap.data?.['Corefile'];
  if (!corefile) {
    throw new Error('CoreDNS Corefile not found in kube-system/coredns');
  }
  const cfg = Config.parseCorefile(corefile);
  res.status(200).json(cfg);
}
