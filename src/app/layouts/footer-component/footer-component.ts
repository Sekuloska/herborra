import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer-component',
  imports: [RouterLink, TranslateModule],
  standalone: true,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss'
})
export class FooterComponent {

}
