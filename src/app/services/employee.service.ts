import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  // public uri: string = "http://localhost:8080/employee";
  public uri: string = "https://sinergiarh-challenge-b.onrender.com/employee";

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get(this.uri);
  }

  create(employee: any) {
    return this.http.post(this.uri, employee);
  }

  edit(employee: any) {
    return this.http.put(this.uri + "/" + employee.id, employee);
  }

  delete(id: number) {
    return this.http.delete(this.uri + "/" + id);
  }

  searchByName(query: string) {
    return this.http.get(this.uri + "/search/name?name=" + query);
  }

  searchBySurname(query: string) {
    return this.http.get(this.uri + "/search/surname?surname=" + query);
  }
}
