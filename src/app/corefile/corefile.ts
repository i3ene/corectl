import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HlmPaginationImports } from '@spartan-ng/helm/pagination';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { map } from 'rxjs';
import { CorefileService } from './corefile.service';

@Component({
  selector: 'app-corefile',
  imports: [HlmTableImports, HlmPaginationImports, AsyncPipe],
  templateUrl: './corefile.html',
  styleUrl: './corefile.css',
})
export class Corefile {
  private readonly corefileService = inject(CorefileService);
  protected readonly serverBlocks = this.corefileService
    .get()
    .pipe(map((corefile) => corefile.serverBlocks));
}
