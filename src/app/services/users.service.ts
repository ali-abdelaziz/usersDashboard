/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Users } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  api: string = environment.api + '/users';
  search = new BehaviorSubject<string>("");
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<Users>(`${this.api}`);
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}
