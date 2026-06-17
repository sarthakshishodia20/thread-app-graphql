import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { GraphQLModule } from './graphql.module';
import { importProvidersFrom } from '@angular/core';

// ==========================================
// APP CONFIG — Yahan sab providers register hote hain:
//
// 1. provideRouter(routes) → Angular routing
// 2. provideHttpClient() → HttpClient (Apollo isko use karta hai requests ke liye)
// 3. GraphQLModule → Apollo Client setup
// ==========================================

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(GraphQLModule),
  ]
};
