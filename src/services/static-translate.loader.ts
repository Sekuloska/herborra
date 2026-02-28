import { Injectable } from "@angular/core";
import { TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import mk from '../assets/i18n/mk.json';
import al from '../assets/i18n/al.json';



@Injectable()
export class StaticTranslateLoader implements TranslateLoader{

    private readonly translation: Record<string, TranslationObject> = {
        mk,
        al,
    }

    getTranslation(lang: string): Observable<TranslationObject> {
        const trans = this.translation[lang] || this.translation['mk'] ||  {};

        return of(trans); 

    }
}