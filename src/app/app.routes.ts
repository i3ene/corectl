import { RedirectFunction, Routes } from '@angular/router';
import { Corefile } from './corefile/corefile';

export const defaultRedirect: RedirectFunction = (redirectData) => routes.at(0)?.path ?? '';

export const routes: Routes = [
  { path: 'corefile', component: Corefile },
  { path: '**', redirectTo: defaultRedirect },
];
