import { Routes } from '@angular/router';
import { GlobalLayoutComponent } from './layouts/global-layout-component/global-layout-component';

export const routes: Routes = [
  {
    path: '',
    component: GlobalLayoutComponent,
    children: [
      {
        path: '',
        title: 'Home | Herborra',
        loadComponent: () => import('../features/home/home-component').then(m => m.HomeComponent),
        data: {
          seo: {
            titleKey: 'SEO.HOME.TITLE',
            descKey: 'SEO.HOME.DESC',
            canonicalPath: '/',
            ogImage: '/assets/hero-section-image.jpg',
            jsonLd: {
              type: 'LocalBusiness',
              nameKey: 'SEO.BUSINESS.NAME',
              descriptionKey: 'SEO.BUSINESS.DESC',
              image: '/assets/hero-section-macedonian.png',
              addressKey: 'SEO.BUSINESS.ADDRESS',
              cityKey: 'SEO.BUSINESS.CITY',
              phoneKey: 'SEO.BUSINESS.PHONE'
            }
          }
        }
      },
      {
        path: 'services',
        title: 'Services | Herborra',
        loadComponent: () => import('../features/home/sections/services-section/services-section').then(m => m.ServicesSection),
        data: {
          seo: {
            titleKey: 'SEO.SERVICES.TITLE',
            descKey: 'SEO.SERVICES.DESC',
            canonicalPath: '/services',
            ogImage: '/assets/services/dijabet-mk.png',
            jsonLd: {
              type: 'Product',
              nameKey: 'SEO.PRODUCTS.DEFAULT.NAME',
              descriptionKey: 'SEO.PRODUCTS.DEFAULT.DESC',
              image: '/assets/services/dijabet-mk.png',
              brandName: 'Herborra'
            }
          }
        }
      },
      {
        path: 'our-story',
        title: 'Our Story | Herborra',
        loadComponent: () => import('../features/home/sections/our-story-component/our-story-component').then(m => m.OurStoryComponent),
        data: {
          seo: {
            titleKey: 'SEO.OUR_STORY.TITLE',
            descKey: 'SEO.OUR_STORY.DESC',
            canonicalPath: '/our-story',
            ogImage: '/assets/our-story/our-story-image1.png'
          }
        }
      },
      {
        path: '**',
        loadComponent: () => import('../features/not-found/not-found.component').then(m => m.NotFoundComponent),
        data: {
          seo: {
            titleKey: 'SEO.NOT_FOUND.TITLE',
            descKey: 'SEO.NOT_FOUND.DESC',
            canonicalPath: '/404',
            robots: 'noindex,nofollow'
          }
        }
      }
    ],
  },
];
