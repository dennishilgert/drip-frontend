import { Component, Input } from '@angular/core'
import { uniqueId } from '../../helpers/uuidHelper'

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent {
  id: string = uniqueId()
  @Input() to = '/'
  @Input() exactMatch = false
  @Input() width = ''
  @Input() height = ''
}
