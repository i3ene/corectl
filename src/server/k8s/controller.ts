import { Request, Response } from 'express';
import { k8sApi } from './connection';
import { Corefile } from './coredns/corefile';

export async function getCorefile(req: Request, res: Response): Promise<void> {
  const configMap = await k8sApi.readNamespacedConfigMap({
    name: 'coredns',
    namespace: 'kube-system',
  });
  const corefile = configMap.data?.['Corefile'];
  if (!corefile) {
    throw new Error('CoreDNS Corefile not found in kube-system/coredns');
  }
  console.log(corefile);
  const parsed = Corefile.parse(corefile);
  res.status(200).json(parsed);
}
