import { Component, OnInit, ViewChild } from '@angular/core';
import { ICombinedSending, IFileSending, IMessageSending, ISending } from 'src/app/models/sending.model';
import { ModalComponent, ModalState } from 'src/app/shared/components/modal/modal.component';
import { SendingService } from '../services/sending.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('inboxModal') inboxModalComponent!: ModalComponent

  get inbox (): ICombinedSending[] {
    return this.sendingService.inbox
  }

  get unreadSendings (): boolean {
    return (this.inboxModalComponent?.state === ModalState.HIDDEN) && this.sendingService.unreadSendings
  }

  constructor (private sendingService: SendingService) { }

  ngOnInit(): void {
  }

  clearInbox (event: Event): void {
    event.preventDefault()
    this.sendingService.clearInbox()
  }

  toggleInboxModal (event: Event): void {
    event.preventDefault()
    this.inboxModalComponent.toggleModal(event)

    this.sendingService.unreadSendings = false
  }
}
