import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  homeLink: string[] = ['/mk'];

  constructor(private route: ActivatedRoute) {
    const lang = this.route.snapshot.paramMap.get('lang');
    this.homeLink = lang === 'al' ? ['/al'] : ['/mk'];
  }
}
