import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../models/users.model';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from "../../shared/components/search-input/search-input.component";
import { FilterPipe } from '../../pipes/filter.pipe';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SearchInputComponent, FilterPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: WritableSignal<Users[]> = signal<Users[]>([]);
  filterForm!: FormGroup;
  isViewUserModalOpen = signal(false);
  userData: any;
  viewUserMode: boolean = false;
  searchTerm: string = '';
  searchKey:string = "";
  sortType: string = 'asc';

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private router: Router,
  ) {
    this.initFilterfForm();
  }

  ngOnInit(): void {
    this.getUsers();
    this.usersService.search.subscribe((res) => {
      this.searchKey = res;
    });
  }

    initFilterfForm(): void {
      this.filterForm = this.fb.group({
        userName: ['default', Validators.required],
        email: ['default', Validators.required],
      });
    }

  getUsers() {
    this.spinnerService.show();
    this.usersService.getUsers()
    .pipe(
      tap((data: any) => {
        this.users.set(data)
      })
    )
    .subscribe((res) => {
      this.users.set(res);
    });
    this.spinnerService.hide();
  }

  getUserById(id: number) {
    this.spinnerService.show();
    this.usersService.getUserById(id).subscribe((res) => {
      this.userData = res;
      // console.log(res);
    });
    this.spinnerService.hide();
  }

  openViewUserModal(item: Users) {
    item.isSelected = !item.isSelected;
    this.isViewUserModalOpen.set(true);
    this.viewUserMode = true;
    this.getUserById(item.id!);
  }

  closeViewUserModal() {
    this.isViewUserModalOpen.set(false);
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    // console.log(this.searchTerm);
    this.usersService.search.next(this.searchTerm);
  }

  sortUsers() {
    switch (this.sortType) {
      case 'asc':
        this.users.update(users => users.sort((a, b) => a.name.localeCompare(b.name)));
        console.log(this.sortType);
        this.sortType = 'desc';
        break;
      case 'desc':
        this.users.update(users => users.sort((a, b) => b.name.localeCompare(a.name)));
        this.sortType = 'asc';
        break;
        default:
        this.users.update(users => users.sort((a, b) => a.id - b.id));
        this.sortType = 'asc';
    }
  }

}
