import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public loadingFlag: boolean = true;
  public loadingFlag2: boolean = true;

  public filteredEmployeeList: any = [];

  public employeeList: any = [];

  public activeEmployee: any = null; 

  public creatingEmployee: boolean = false;

  public taskCategories: any = [];

  public checkedTasks: Array<number> = [];
  public nameInputValue: string = "";
  public surnameInputValue: string = "";
  public phoneInputValue: number | null = null;
  public genderInputValue: string = "";
  public tutorInputValue: string = "";

  constructor(private employeeService: EmployeeService, private taskService: TaskService, private http: HttpClient) { }

  ngOnInit(): void {
    this.employeeService.findAll().subscribe(res => {
      if (!this.loadingFlag2) {
        this.loadingFlag = false;
      } else {
        this.loadingFlag2 = false;
      }
      this.employeeList = res;
      this.filteredEmployeeList = res
      this.handleEmployee(this.employeeList[0])
    });

    this.taskService.findAllCategories().subscribe(res => {
      this.taskCategories = res;
      for (let i = 1; i <= 4; i++) {
        this.taskService.findByCategory(i).subscribe(res => {
          if (!this.loadingFlag2) {
            this.loadingFlag = false;
          } else {
            this.loadingFlag2 = false;
          }
          this.taskCategories[i-1].tasks = res
        })
      }
    })
  }

  handleEmployee(employee: any) {
    this.activeEmployee = employee;
    this.nameInputValue = employee.name;
  }

  handleTask(id: number) {
    if (this.checkedTasks.find(task => task == id)) {
      this.checkedTasks = this.checkedTasks.filter(task => task != id);
    } else {
      this.checkedTasks.push(id);
    }
  }

  handleCreateEmployeeButton() {
    if (this.nameInputValue != ""
        && this.surnameInputValue != ""
        && this.genderInputValue != ""
        && this.tutorInputValue != ""
        && this.checkedTasks.length > 0) {
          this.employeeService.create({
          // this.http.post(this.employeeService.uri, {
            "name": this.nameInputValue,
            "surname": this.surnameInputValue,
            "phone": this.phoneInputValue,
            "gender_id": this.genderInputValue == "Femenino" ? 1 : 2,
            "tutor_id": this.tutorInputValue == "Sin tutor" ? null : this.tutorInputValue,
            "tasks_ids": this.checkedTasks
          }).subscribe(res => {
            this.employeeList.push(res);
            this.filteredEmployeeList = this.employeeList;
          }, err => {
            console.error(err)
          })
    }
  }
}
