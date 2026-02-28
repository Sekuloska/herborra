import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { provideHttpClient } from '@angular/common/http';
import {  
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
  TranslateLoader,
  provideTranslateLoader,
  provideTranslateService } from '@ngx-translate/core';

import { routes } from './app.routes';
import { IMAGE_CONFIG } from '@angular/common';
import { StaticTranslateLoader } from '../services/static-translate.loader';


// export class DevMissingTranslationHandler implements MissingTranslationHandler {
//   handle(params: MissingTranslationHandlerParams) {
//     if (isDevMode()) {
//       console.warn('[i18n] Missing translation key:', params.key);
//     }
//     return params.key;
//   }
// }

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
        preset: Lara, // ???? Lara light ???? ?????�???�?�
        options: {
          darkModeSelector: false // ?????????????????� ???�???� ?� ?????�?�?�?�
        }
      }
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslateService({
      fallbackLang: 'mk',
      loader: provideTranslateLoader(StaticTranslateLoader),
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: DevMissingTranslationHandler
      }
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



