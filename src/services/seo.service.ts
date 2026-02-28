import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

type JsonLdType = 'LocalBusiness' | 'Product' | 'Article';
type OgType = 'website' | 'article' | 'product';

interface JsonLdConfig{
  type: JsonLdType;
  nameKey: string;
  descriptionKey?: string;
  image?: string;
  addressKey?: string;
  cityKey?: string;
  phoneKey?: string;
  brandName?: string;

}

export interface SeoRouteData {
  titleKey: string;
  descKey: string;
  canonicalPath: string;
  keywords: string;
  author?: string;
  ogImage?: string;
  robots?: string;
  jsonLd?: JsonLdConfig;
  ogType? : OgType;
}

@Injectable({ providedIn: 'root' })
export class SeoService 
{
  private readonly baseUrl = 'https://herborra.mk';
  private readonly supportedLangs = ['mk', 'al'] as const;
  private currentSeo?: SeoRouteData;

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private title: Title,
              private meta: Meta,
              private translate: TranslateService,
              @Inject(DOCUMENT) private doc: Document){}


  init(): void {
    
    //Observable core RxJS za handle na asinhroni data streams i event kako HTTP, user input i timers. Toa se streams na podatoci sto moze da emit pov ekje vrednosti niz vremeto
    //Promises samo edna vrednost 

    //Observaable e producer na data streams na vrednosti 
    //Observer e objekt so callback funkcija(next, error, complete) koisto reagiraat na vrednostite od Observable 

    //Izvrsuvanjeto na Observable zapocnuva koga Observer se subscribe na toa

    //this.router.events. - Observable sto emit events sekogas koga se slucuva navigacija 
    // filtriram: deka sakam SEO da bide setirano samo koga navigacijata e zavrsena so NavigationEnd
    // map : zemam SEO od najdlabokata ruta, deka za sekoja ruta imam posebno SEO 
    // startWith: za prvo vcituvanje. Pred da pocnat da doagaat nastani od router.events so startWith stavam edna pocetna, inicijalna vrednost za prvoto renderiranje na SEO 

    const routeSeo$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getDeepestRoute(this.route).snapshot.data?.['seo'] as SeoRouteData | undefined),
      startWith(this.getDeepestRoute(this.route).snapshot.data?.['seo'] as SeoRouteData | undefined)
    );

    // sekogas koga ke ima nov SEO (odnosno rutiral na druga strana, setiraj go)
    routeSeo$.subscribe((seo) => {
      if(!seo){
        return;
      }
      this.currentSeo = seo;
      const routeLang = this.getRouteLang();
      this.setDocumetnLang(this.toHtmlLang(routeLang)); 
      this.applySeo(seo, routeLang);
    });

    //pri promena na jazik a istata strana, setiraj seo 
    this.translate.onLangChange.subscribe(() => {
      const routeLang = this.getRouteLang();
      this.setDocumetnLang(this.toHtmlLang(routeLang));
      if(this.currentSeo){
        this.applySeo(this.currentSeo, routeLang);
      }
    });

    //safety, duri i ako routeSeo$ uste ne emit, translations uste ne se vcitani, barem html lang da e tocen. 
    this.setDocumetnLang(this.toHtmlLang(this.getRouteLang()));

    //instance of NavigationEnd: sakame da reagirame samo koga navigacijata zavrsila

    //routeSeo e producer na data stream - Observable 
  }

 

    private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
      let current = route;
      while (current.firstChild) {
        current = current.firstChild;
      }
      return current;
    }

  //   titleKey: string;
  // descKey: string;
  // canonicalPath: string;
  // keywords: string;
  // author?: string;
  // ogImage?: string;
  // robots?: string;
  // jsonLd: JsonLdConfig;
    private applySeo(seo : SeoRouteData, lang: 'mk' | 'al')
    {
     //console.log('seo object:', seo);

      const keys = [seo.titleKey, seo.descKey, seo.keywords, seo.ogType]
        .filter((k): k is string => typeof k === 'string' && k.length > 0);

       // console.log("With the filter ", keys);

      this.translate.get(keys).subscribe((t) => {
        const title = t[seo.titleKey];
        const desc = t[seo.descKey];
        const keywords = seo.keywords ? (t[seo.keywords] ?? '') : '';
        const ogType = seo.ogType ? (t[seo.ogType] ?? '') : '';

       //console.log('translate keys:', title, desc, keywords);

        this.title.setTitle(title);
        this.setMeta('name', 'description', desc);
        this.setMeta('name', 'robots', seo.robots ?? 'index,follow');
        this.setMeta('name', 'author', seo.author ?? 'Herborra');

        this.setMeta('name', 'keywords', keywords);
        

        const canonical = this.buildCanonicalPath(lang, seo.canonicalPath);
        this.setCanonical(canonical);
        this.setAlternateLinks(seo.canonicalPath);

        this.setMeta('property', 'og:title', title);
        this.setMeta('property', 'og:description', desc);
        this.setMeta('property', 'og:type', ogType);
        this.setMeta('property', 'og:locale', lang === 'al' ? 'sq_AL' : 'mk_MK');
        this.setMeta('property', 'og:url', canonical);

        if(seo.ogImage)
        {
          this.setMeta('property', 'og:image', this.absUrl(seo.ogImage));
        }

        if(seo.jsonLd)
        {
          this.setJsonLd(this.buildJsonLd(seo.jsonLd, canonical, lang));
        }else{
          this.removeJsonLD();
        }

      })
    }

    //<link rel="canonical" href="https://herborra.mk/mk/services"> - ova na google mu kazuva ova e stranicata sto go prikazuva originalniot content. so ovoj tag se sprecuva duplikat na content 
        private setCanonical(href: string): void {
        this.setLinkTag('canonical', href);
      }


      private setLinkTag(rel: string, href: string): void{

        let link =
        this.doc.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

        if(!link){
          link = this.doc.createElement('link');
          link.setAttribute('rel', rel);
          this.doc.head.appendChild(link);
        }

        link.setAttribute('href', href);
      }

      //<link rel="alternate" hreflang="mk" href="https://herborra.mk/mk/services"> ovoj link tag se stava koga imame multijazicnost na samiot site za da se znae koja verzija za koj jazik e, ako ne default
      //<link rel="alternate" hreflang="sq" href="https://herborra.mk/al/services">
      //<link rel="alternate" hreflang="x-default" href="https://herborra.mk/mk/services">

      // this.setLinkTagWithAttr('alternate', 'hreflang', 'mk', this.buildCanonicalUrl('mk', canonicalPath)); -  povik na ovaa funkcija

      private setAlternateLinks(canonicalPath : string):void {
        this.setLinkTagWithAttr('alternate', 'hreflang', 'mk', this.buildCanonicalPath('mk', canonicalPath));
        this.setLinkTagWithAttr('alternate', 'hreflang', 'sq', this.buildCanonicalPath('al', canonicalPath));
        this.setLinkTagWithAttr('alternate', 'hreflang', 'x-default', this.buildCanonicalPath('mk', canonicalPath));

        //stignav do tuka 
      }
      
      private setLinkTagWithAttr(rel: string, attrName: string, attrValue: string, href:string): void {

        let link = this.doc.head.querySelector(
          `link[rel="${rel}"][${attrName}="${attrValue}"]`
        ) as HTMLLinkElement | null;

        if(!link)
        {
          link = this.doc.createElement('link');
          link.setAttribute('rel', rel);
          link.setAttribute(attrName, attrValue);
          this.doc.head.appendChild(link);

        }

        link.setAttribute('href', href);
      }


      //kreiranje na url do slikite
      private absUrl(path:string): string{
        return `${this.baseUrl}${path.startsWith('/') ? path : `${path}`}`;
      }

    private buildCanonicalPath(lang: 'mk' | 'al', canonicalPath: string): string {
      const normalizePath = 
        canonicalPath === '/' || canonicalPath === ''
          ? ''
          : canonicalPath.startsWith('/')
            ? canonicalPath 
            : `/${canonicalPath}`;

      return `${this.baseUrl}/${lang}${normalizePath}`;

    }

    //kreiranje na JsonLd objekt
    //buildJsonLd(seo.jsonLd, canonical, lang)

// <script type="application/ld+json">
// {
//   "@context": "http://schema.org",
//   "@type": "WebPage",
//   "name": "Angular SEO Optimization Guide",
//   "description": "Step-by-step guide on optimizing Angular apps for SEO."
// }
// </script>

    private buildJsonLd(config: JsonLdConfig, canonical: string, lang: 'al' | 'mk')
    {
      if(config.type == 'LocalBusiness'){
        return {
          "@context" : "http://schema.org",
          '@type': 'LocalBusiness',
          "name": this.translate.instant(config.nameKey),
          "description" : config.descriptionKey ? this.translate.instant(config.descriptionKey) :undefined,
          "url" : canonical,
          "inLanguage" : this.toHtmlLang(lang),
          "image": config.image ? this.absUrl(config.image) : undefined,
          "address" : {
             '@type': 'PostalAddress',
              "streetAddress" : config.addressKey ? this.translate.instant(config.addressKey) : undefined,
              "addressLocality": config.cityKey ? this.translate.instant(config.cityKey) : undefined,
              "addressCountry": 'MK',
          },
          "telephone": config.phoneKey ? this.translate.instant(config.phoneKey) : undefined,
        };
      }

       if (config.type === 'Product') {
          return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: this.translate.instant(config.nameKey),
            description: config.descriptionKey ? this.translate.instant(config.descriptionKey) : undefined,
            image: config.image ? this.absUrl(config.image) : undefined,
            brand: config.brandName ? { '@type': 'Brand', name: config.brandName } : undefined,
          };
        }

        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          name: this.translate.instant(config.nameKey),
          description: config.descriptionKey ? this.translate.instant(config.descriptionKey) : undefined,
          url: canonical,
          inLanguage: this.toHtmlLang(lang),
        }

    }

    //set na jsonLd vo script tag
    private setJsonLd(json: Record<string, unknown>): void {
      const id = 'seo-jsonld';

      let script = this.doc.getElementById(id) as HTMLScriptElement | null; 

      if(!script){
        script = this.doc.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        this.doc.head.appendChild(script);
      }
      script.textContent = JSON.stringify(json);
    }

    //dokolku ne postoi JsonLd konfiguracija - model, vo toj slucaj trgni go skroz od DOM. Primer ako sum na Home i se prefrlam na druga strana, stranata ne se refresh celosno i moze da se zadrzi prethodniot jsonLD

    private removeJsonLD() : void{
      const script = this.doc.getElementById('seo-jsonld');
      if(script?.parentNode){
        script.parentNode.removeChild(script);
      }
    }



    private setMeta(attr: 'name' | 'property', key:string, content: string): void {
      this.meta.updateTag({ [attr]: key, content});
    }

    private getRouteLang(): 'mk' | 'al' {
      const deepest = this.getDeepestRoute(this.route).snapshot;

      for( let i = deepest.pathFromRoot.length -1; i >=0; i--){
        const raw = deepest.pathFromRoot[i].paramMap.get('lang');

        if(raw && this.isSupportedLang(raw))
        {
          return raw;
        }

      }
       return 'mk';
    }

    private isSupportedLang(value: string ): value is 'mk' | 'al'{
      return (this.supportedLangs as readonly string[]).includes(value);
    }

    private setDocumetnLang(lang: 'mk' | 'sq'):void{
      this.doc.documentElement.lang = lang; 
    }

    private toHtmlLang(lang: 'mk' | 'al'): 'mk' | 'sq'{
      return lang === 'al' ? 'sq' : 'mk';
    }

  // init(): void{
    
  // }



 
 
    



}
