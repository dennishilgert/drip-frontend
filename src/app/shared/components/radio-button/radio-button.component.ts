import { Component, EventEmitter, Input, Output } from '@angular/core'
import { uniqueId } from '../../helpers/uuidHelper'

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent {
  id: string = uniqueId()
  @Input() name = ''
  @Input() value = ''
  @Input() width = ''
  @Input() height = ''
  @Input() checked = false
  @Input() disabled = false
  @Output() selectionChange: EventEmitter<string> = new EventEmitter<string>()

  onSelectionChange(value: string) {
    this.selectionChange.emit(value)
  }
}
