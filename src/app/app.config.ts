import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import {  
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  provideTranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';
import { IMAGE_CONFIG } from '@angular/common';


//importProvidersFrom

export function translateLoaderFactory() {
  return new TranslateHttpLoader();
}



export class DevMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    if (isDevMode()) {
      console.warn('[i18n] Missing translation key:', params.key);
    }
    return params.key;
  }
}



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: Lara, // рџЊћ Lara light РїРѕ РґРёС„РѕР»С‚
        options: {
          darkModeSelector: false // РѕСЃРёРіСѓСЂСѓРІР° РґРµРєР° Рµ СЃРІРµС‚Р»Р°
        }
      }
    }),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      fallbackLang: 'mk',
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory
      },

      missingTranslationHandler:{
        provide: MissingTranslationHandler,
        useClass: DevMissingTranslationHandler
      }
    }),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    }),
    {
    provide: IMAGE_CONFIG,
    useValue: {
      disableImageSizeWarning: true,
      disableImageLazyLoadWarning: true
    }
  },


    
  ]
};


