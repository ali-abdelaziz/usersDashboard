import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild, OnInit, AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit, AfterViewInit {
  @ViewChild('listFilter') listFilter?: ElementRef;
  @Output() filterInput = new EventEmitter<string>();
  filterForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  unsubscribe$: Subject<boolean> = new Subject();

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    // Init form
    this.initFilterForm(false);
  }

  initFilterForm(multiSelectOn: boolean): void {
    this.filterForm = this.fb.group({
      filter: multiSelectOn ? [{ value: '', disabled: true }] : [''],
      sort: multiSelectOn ? [{ value: '', disabled: true }] : [''],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.listFilter) this.filterInputObservable(this.listFilter);
    }, 500);
  }

  filterInputObservable(input: ElementRef): void {

    // let filterInput = fromEvent(_input.nativeElement, 'keyup')
      fromEvent(input.nativeElement, 'keyup')
      .pipe(debounceTime(1000), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        if (
          this.filterForm.get('filter')?.value?.length > 2 ||
          this.filterForm.get('filter')?.value?.length == 0
        ) {
          this.isLoading = true;

          setTimeout(() => {
            this.isLoading = false;
            this.filterInput.emit(this.filterForm.get('filter')?.value);
          }, 700);
        }
      });
  }
}
