import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { provideUniversal } from '@ng-web-apis/universal';
import { appConfig } from '../app/app.config';
import { serverRoutes } from './server.routes';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes)), provideUniversal()],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
