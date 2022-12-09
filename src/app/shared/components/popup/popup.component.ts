import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/core/services/popup.service';
import { IPopup } from 'src/app/models/popup.model';

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

  dismissPopup () {
    this.popupService.dismissPopup()
  }

  onLeftButtonClick (event: Event): void {
    event.preventDefault()
    this.currentPopup!.leftButtonCallback!()
  }

  onRightButtonClick (event: Event): void {
    event.preventDefault()
    this.currentPopup!.rightButtonCallback!()
  }
}
