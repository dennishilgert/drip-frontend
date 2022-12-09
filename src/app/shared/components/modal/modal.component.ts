import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { randomString } from '../../helpers/stringHelper';

export enum ModalState {
  SHOWN = 'shown',
  HIDDEN = 'hidden'
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  readonly id: string = randomString(8)
  private _state: ModalState = ModalState.HIDDEN
  @Input() title: string = ''
  @Input() leftButton: string = ''
  @Input() rightButton: string = ''
  @Output() onLeftButton: EventEmitter<Event> = new EventEmitter<Event>()
  @Output() onRightButton: EventEmitter<Event> = new EventEmitter<Event>()

  get state (): ModalState {
    return this._state
  }

  constructor() { }

  ngOnInit(): void { 
  }

  toggleModal (event: Event) {
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

  onLeftButtonClick (event: Event) {
    event.preventDefault()
    this.onLeftButton.emit(event)
  }

  onRightButtonClick (event: Event) {
    event.preventDefault()
    this.onRightButton.emit(event)
  }
}
