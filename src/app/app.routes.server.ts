import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ lang: 'mk' }, { lang: 'al' }];
    },
  },
  {
    path: ':lang/our-story',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ lang: 'mk' }, { lang: 'al' }];
    },
  },
  {
    path: ':lang/services',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ lang: 'mk' }, { lang: 'al' }];
    },
  },
  {
    path: ':lang/404',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ lang: 'mk' }, { lang: 'al' }];
    },
  },
  { path: '**', renderMode: RenderMode.Client },
];
