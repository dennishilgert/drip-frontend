import { Component, ViewChild } from '@angular/core'
import { ICombinedTransmission } from 'src/app/models/transmission.model'
import { ModalComponent, ModalState } from 'src/app/shared/components/modal/modal.component'
import { TransmissionService } from '../services/transmission.service'
import linkifyHtml from 'linkify-html'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('inboxModal') inboxModalComponent!: ModalComponent

  get inbox(): ICombinedTransmission[] {
    return this.transmissionService.inbox
  }

  get unreadTransmissions(): boolean {
    return this.inboxModalComponent?.state === ModalState.HIDDEN && this.transmissionService.unreadTransmissions
  }

  constructor(private transmissionService: TransmissionService) {}

  clearInbox(event: Event): void {
    event.preventDefault()
    this.transmissionService.clearInbox()
  }

  toggleInboxModal(event: Event): void {
    event.preventDefault()
    this.inboxModalComponent.toggleModal(event)

    this.transmissionService.unreadTransmissions = false
  }

  linkify(message: string): string {
    return linkifyHtml(message, { defaultProtocol: 'https' })
  }
}
