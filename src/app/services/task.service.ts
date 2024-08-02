import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // private uri: string = "http://localhost:8080/task";
  public uri: string = "https://sinergiarh-challenge-b.onrender.com/task";

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get(this.uri);
  }

  findByCategory(categoryId: number) {
    return this.http.get(this.uri + "/" + categoryId);
  }

  findAllCategories() {
    return this.http.get(this.uri + "/category");
  }
}
