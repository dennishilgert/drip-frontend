import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() buttonType: string = 'primary'
  @Input() size: string = 'medium'
  @Input() width: string = ''
  @Input() height: string = ''
  @Input() padding: boolean = true
  @Input() loading: boolean = false
  @Input() disabled: boolean = false

  @Output() onClick: EventEmitter<Event> = new EventEmitter<Event>()

  constructor () { }

  ngOnInit (): void {
  }

  onButtonClick (event: Event) {
    event.preventDefault()
    if (this.loading || this.disabled) return
    this.onClick.emit(event)
  }
}
