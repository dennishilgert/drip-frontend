import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/core/services/popup.service';
import { IPopup } from 'src/app/models/popup.model';
import { escapeHtml } from '../../helpers/safetyHelper';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  get currentPopup (): IPopup | undefined {
    return this.popupService.currentPopup
  }

  constructor (public popupService: PopupService) { }

  ngOnInit(): void {
  }

  escapeHtml (input: string): string {
    return escapeHtml(input)
  }

  dismissPopup () {
    this.popupService.dismissPopup()
  }

  onLeftButtonClick (event: Event): void {
    event.preventDefault()
    if (this.currentPopup!.leftButtonCallback) this.currentPopup!.leftButtonCallback!()
    this.dismissPopup()
  }

  onRightButtonClick (event: Event): void {
    event.preventDefault()
    if (this.currentPopup!.rightButtonCallback) this.currentPopup!.rightButtonCallback!()
    this.dismissPopup()
  }
}
