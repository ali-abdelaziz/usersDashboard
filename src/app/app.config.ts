import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(
      FormsModule,
      BrowserAnimationsModule,
      NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    ),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
  ]
};
