import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { uniqueId } from '../../helpers/uuidHelper'

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css']
})
export class RadioButtonComponent implements OnInit {
  id: string = uniqueId()
  @Input() name: string = ''
  @Input() value: string = ''
  @Input() width: string = ''
  @Input() height: string = ''
  @Input() checked: boolean = false
  @Input() disabled: boolean = false
  @Output() onChangeEvent: EventEmitter<string> = new EventEmitter<string>()

  constructor() { }

  ngOnInit(): void {
  }

  onSelectionChange (value: string) {
    this.onChangeEvent.emit(value)
  }
}
