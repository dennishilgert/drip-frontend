import { Component } from '@angular/core'
import { IdentityService } from 'src/app/core/services/identity.service'
import { ILookupIdentity, ILookupIdentityData } from 'src/app/models/identity.model'

@Component({
  selector: 'app-direct-page',
  templateUrl: './direct-page.component.html',
  styleUrls: ['./direct-page.component.css']
})
export class DirectPageComponent {

  private _matchedIdentity = ''

  get matchedIdentity (): string {
    return this._matchedIdentity
  }

  constructor (private identityService: IdentityService) { }

  searchIdentity (searchInput: string): void {
    if (!searchInput) {
      this._matchedIdentity = ''
      return
    }

    // capitalize frist letter of each word
    if (searchInput.includes(' ')) {
      const words: string[] = searchInput.split(' ')
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1)
      }
      searchInput = words.join(' ')
    }

    const input: ILookupIdentityData = {
      name: searchInput
    }
    this.identityService
      .lookupIdentity(input)
      .then((lookupIdentity: ILookupIdentity) => {
        if (lookupIdentity.name === this.identityService.getIdentityName) {
          this._matchedIdentity = ''
          return
        }
        this._matchedIdentity = lookupIdentity.name
      })
      .catch(() => {
        this._matchedIdentity = ''
      })
  }
}
