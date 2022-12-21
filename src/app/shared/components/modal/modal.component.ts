import { Component, EventEmitter, Input, Output } from '@angular/core'
import { randomString } from '../../helpers/stringHelper'

export enum ModalState {
  SHOWN = 'shown',
  HIDDEN = 'hidden'
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  readonly id: string = randomString(8)
  private _state: ModalState = ModalState.HIDDEN
  @Input() title = ''
  @Input() leftButtonLabel = ''
  @Input() rightButtonLabel = ''
  @Output() leftButton: EventEmitter<Event> = new EventEmitter<Event>()
  @Output() rightButton: EventEmitter<Event> = new EventEmitter<Event>()

  get state(): ModalState {
    return this._state
  }

  toggleModal(event: Event) {
    event.preventDefault()

    this._state = this._state === ModalState.HIDDEN ? ModalState.SHOWN : ModalState.HIDDEN

    const modalContainer: HTMLElement = document.getElementById('container-' + this.id) as HTMLElement
    const modalBackground: HTMLElement = document.getElementById('background-' + this.id) as HTMLElement
    const modal: HTMLElement = document.getElementById(this.id) as HTMLElement
    modalContainer.classList.toggle('invisible')
    modalBackground.classList.toggle('opacity-0')
    modalBackground.classList.toggle('opacity-50')
    modal.classList.toggle('translate-y-full')
  }
}
