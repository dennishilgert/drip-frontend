import { Component, Input, OnInit } from '@angular/core';
import { uniqueId } from '../../helpers/uuidHelper';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {
  id: string = uniqueId()
  @Input() to: string = '/'
  @Input() exactMatch: boolean = false
  @Input() width: string = ''
  @Input() height: string = ''

  constructor() { }

  ngOnInit(): void {
  }

}
