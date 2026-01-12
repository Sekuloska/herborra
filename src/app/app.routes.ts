import { Routes } from '@angular/router';
import { GlobalLayoutComponent } from './layouts/global-layout-component/global-layout-component';


export const routes: Routes = [
    {
        path: '',
        component: GlobalLayoutComponent, 
             children: [
                {
                    path: '',
                    title: 'Почетна • Herborra',
                    loadComponent: () => import('../features/home/home-component').then(m => m.HomeComponent)
                },
                {
                    path: 'services',
                    title: 'Услуги • Herborra',
                    loadComponent: () => import('../features/home/sections/services-section/services-section').then(m => m.ServicesSection)
                  },
                  {
                    path: 'our-story',
                    title: 'Услуги • Herborra',
                    loadComponent: () => import('../features/home/sections/our-story-component/our-story-component').then(m => m.OurStoryComponent)
                  },

             ],
      },
];
