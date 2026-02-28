import { CanMatchFn, Router, Routes, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { GlobalLayoutComponent } from './layouts/global-layout-component/global-layout-component';

const SUPPORTED_LANGS = new Set(['mk', 'al']);

const langCanMatch: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const lang = segments[0]?.path?.toLowerCase();
  if (lang && SUPPORTED_LANGS.has(lang)) return true;
  return inject(Router).createUrlTree(['/mk/404']);
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mk' },
  {
    path: ':lang',
    canMatch: [langCanMatch],
    component: GlobalLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../features/home/home-component').then((m) => m.HomeComponent),
        data: {
          seo: {
            titleKey: 'SEO.HOME.TITLE',
            descKey: 'SEO.HOME.DESC',
            canonicalPath: '/',
            keywords: 'SEO.HOME.KEYWORDS',
            author: 'Herborra',
            ogImage: '/assets/hero-section-macedonian.png',
            ogType: 'website',
            jsonLd: {
              type: 'LocalBusiness',
              nameKey: 'SEO.BUSINESS.NAME',
              descriptionKey: 'SEO.BUSINESS.DESC',
              image: '/assets/hero-section-macedonian.png',
              addressKey: 'SEO.BUSINESS.ADDRESS',
              cityKey: 'SEO.BUSINESS.CITY',
              phoneKey: 'SEO.BUSINESS.PHONE',
            },
          },
        },
      },
      {
        path: 'services',
        loadComponent: () =>
          import('../features/home/sections/services-section/services-section').then((m) => m.ServicesSection),
        data: {
          seo: {
            titleKey: 'SEO.SERVICES.TITLE',
            descKey: 'SEO.SERVICES.DESC',
            canonicalPath: '/services',
            keywords: 'SEO.SERVICES.KEYWORDS',
            author: 'Herborra',
            ogImage: '/assets/services/dijabet-mk.png',
            ogType: 'product',
            jsonLd: {
              type: 'Product',
              nameKey: 'SEO.PRODUCTS.DEFAULT.NAME',
              descriptionKey: 'SEO.PRODUCTS.DEFAULT.DESC',
              image: '/assets/services/dijabet-mk.png',
              brandName: 'Herborra',
            },
          },
        },
      },
      {
        path: 'our-story',
        loadComponent: () =>
          import('../features/home/sections/our-story-component/our-story-component').then((m) => m.OurStoryComponent),
        data: {
          seo: {
            titleKey: 'SEO.OUR_STORY.TITLE',
            descKey: 'SEO.OUR_STORY.DESC',
            canonicalPath: '/our-story',
            keywords: 'SEO.OUR_STORY.KEYWORDS',
            author: 'Herborra',
            ogImage: '/assets/our-story/our-story-image1.png',
            ogType: 'blog',
            jsonLd: {
              type: 'Article',
              nameKey: 'SEO.OUR_STORY.TITLE',
              descriptionKey: 'SEO.OUR_STORY.DESC',
              image: '/assets/services/dijabet-mk.png',
              brandName: 'Herborra',
            }
          },
        },
      },
      {
        path: '404',
        loadComponent: () => import('../features/not-found/not-found.component').then((m) => m.NotFoundComponent),
        data: {
          seo: {
            titleKey: 'SEO.NOT_FOUND.TITLE',
            descKey: 'SEO.NOT_FOUND.DESC',
            canonicalPath: '/404',
            author: 'Herborra',
            robots: 'noindex,nofollow',
            
          },
        },
      },
    ],
  },
  { path: '**', redirectTo: 'mk/404' },
];
