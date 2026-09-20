import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { ICorefile } from '../../shared/coredns/corefile';

@Service()
export class CorefileService {
  private readonly httpClient = inject(HttpClient);

  public get(): Observable<ICorefile> {
    return this.httpClient.get<ICorefile>('/api/corefile');
  }
}
