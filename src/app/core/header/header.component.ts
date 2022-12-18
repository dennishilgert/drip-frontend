import { Component, OnInit, ViewChild } from '@angular/core';
import { ICombinedTransmission } from 'src/app/models/transmission.model';
import { ModalComponent, ModalState } from 'src/app/shared/components/modal/modal.component';
import { escapeHtml } from 'src/app/shared/helpers/safetyHelper';
import { TransmissionService } from '../services/transmission.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('inboxModal') inboxModalComponent!: ModalComponent

  get inbox (): ICombinedTransmission[] {
    return this.transmissionService.inbox
  }

  get unreadTransmissions (): boolean {
    return (this.inboxModalComponent?.state === ModalState.HIDDEN) && this.transmissionService.unreadTransmissions
  }

  constructor (private transmissionService: TransmissionService) { }

  ngOnInit (): void {
  }

  escapeHtml (input: string): string {
    return escapeHtml(input)
  }

  clearInbox (event: Event): void {
    event.preventDefault()
    this.transmissionService.clearInbox()
  }

  toggleInboxModal (event: Event): void {
    event.preventDefault()
    this.inboxModalComponent.toggleModal(event)

    this.transmissionService.unreadTransmissions = false
  }
}
