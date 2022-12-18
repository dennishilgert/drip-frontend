import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { escapeHtml } from '../../helpers/safetyHelper';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  constructor (public toastService: ToastService) { }

  ngOnInit (): void {
  }

  escapeHtml (input: string): string {
    return escapeHtml(input)
  }

  dismiss (id: string): void {
    this.toastService.dismissToast(id)
  }
}
