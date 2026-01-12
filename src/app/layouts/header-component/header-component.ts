import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


type Lang = 'mk' | 'al';
const STORAGE_KEY = 'lang'; 


@Component({
  selector: 'app-header-component',
  imports: [RouterLink, TranslateModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
  standalone: true
})
export class HeaderComponent {

   currentLang: Lang = 'mk';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const current = this.translate.currentLang as Lang | undefined;
    this.currentLang = current ?? (this.translate.defaultLang as Lang) ?? 'mk';
  }

  setLang(lang: Lang) {
    if (this.currentLang === lang) return;
    this.translate.use(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.currentLang = lang;
  }

  
}













