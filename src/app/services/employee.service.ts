import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  public uri: string = "http://localhost:8080/employee"

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get(this.uri);
  }

  create(employee: any) {
    return this.http.post(this.uri, employee);
  }
}
