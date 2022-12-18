import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, debounceTime, skip } from 'rxjs';
import { randomString } from '../../helpers/stringHelper';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  readonly id: string = randomString(8)
  @Input() placeholder: string = ''
  @Input() name: string = ''
  @Input() disabled: boolean = false
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>()

  searchInput: BehaviorSubject<string> = new BehaviorSubject<string>('')

  constructor () { }

  ngOnInit (): void {
    this.searchInput
      .pipe(
        skip(1),
        debounceTime(500)
      )
      .subscribe((value: string) => {
        this.onSearch.emit(value)
      })
  }

  clearInput (event: Event): void {
    event.preventDefault()
    this.searchInput.next('')
  }
}
