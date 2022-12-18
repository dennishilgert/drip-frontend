import { Component, OnInit } from '@angular/core';
import { escapeHtml } from 'src/app/shared/helpers/safetyHelper';
import { IdentityService } from '../services/identity.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  get name (): string {
    return this.identityService.getIdentityName
  }

  constructor (private identityService: IdentityService) { }

  ngOnInit (): void {
  }

  escapeHtml (input: string): string {
    return escapeHtml(input)
  }
}
