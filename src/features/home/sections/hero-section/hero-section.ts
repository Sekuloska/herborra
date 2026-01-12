import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ButtonModule, RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  private readonly emailAddress = 'info@herborra.mk';
  private readonly subject = encodeURIComponent('Прашање за Хербора');
  private readonly body = encodeURIComponent(
    'Здраво,\n\n' +
      'Ве контактирам во врска со вашите производи за природен билен чај.....\n\n' +
      'Ви благодарам,\n'
  );
  public readonly mailtoLink = `mailto:${this.emailAddress}?subject=${this.subject}&body=${this.body}`;

}
