import { Component } from '@angular/core'
import { IdentityService } from '../services/identity.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  get name (): string {
    return this.identityService.getIdentityName
  }

  constructor (private identityService: IdentityService) { }
}
