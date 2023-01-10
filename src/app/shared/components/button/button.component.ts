import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() buttonType = 'primary'
  @Input() size = 'medium'
  @Input() width = ''
  @Input() height = ''
  @Input() padding = true
  @Input() loading = false
  @Input() disabled = false

  @Output() buttonClick: EventEmitter<Event> = new EventEmitter<Event>()
}
