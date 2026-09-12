import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

// 👇 Reemplaza SOLO la parte final por el nombre real de tu scope
// (lo copias completo desde "Expose an API" en Azure)
const SCOPE_BACKEND = 'api://8f72ba0f-8036-40e2-9465-c8ae3891444d/access_as_user';

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '8f72ba0f-8036-40e2-9465-c8ae3891444d',
      authority: 'https://login.microsoftonline.com/064d1db6-6358-4f36-bbb6-11dfe3537831',
      redirectUri: 'http://localhost:4200'
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [SCOPE_BACKEND]
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('http://localhost:8081/*', [SCOPE_BACKEND]); // inventario
  protectedResourceMap.set('http://localhost:8082/*', [SCOPE_BACKEND]); // pedidos

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // 👈 necesario para que MsalInterceptor funcione
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalInterceptor,
    MsalBroadcastService
  ]
};