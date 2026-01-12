import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header-component/header-component';
import { FooterComponent } from '../footer-component/footer-component';
import { I18nService } from '../../../services/i18n.service';


@Component({
  selector: 'app-global-layout-component',
  imports: [ HeaderComponent, FooterComponent, RouterOutlet],
  standalone: true,
  templateUrl: './global-layout-component.html',
  styleUrl: './global-layout-component.scss'
})
export class GlobalLayoutComponent {

   constructor(private i18n: I18nService) {}

  ngOnInit() {
    this.i18n.init();
  }

}


