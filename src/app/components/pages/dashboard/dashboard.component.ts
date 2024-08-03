import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { TaskService } from 'src/app/services/task.service';

// Página del dashboard, contiene todas las utilidades de la aplicación

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public loadingFlag: boolean = true;
  public loadingFlag2: boolean = true;
  public loadingForm: boolean = false;
  public loadingSearch: boolean = false;

  public filteredEmployeeList: any = [];

  public employeeList: any = [];

  public activeEmployee: any = null;

  public creatingEmployee: boolean = false;
  public editingEmployee: boolean = false;

  public taskCategories: any = [];

  public checkedTasks: Array<number> = [];
  public nameInputValue: string = "";
  public surnameInputValue: string = "";
  public phoneInputValue: number | null = null;
  public genderInputValue: string = "";
  public tutorInputValue: string = "";

  public formError: boolean = false;
  public errorMessage: string = "";

  public tutorList: any = [];

  public searchByNameInputValue: string = "";
  public searchBySurnameInputValue: string = "";

  public searchError: boolean = false;
  public searchErrorMessage: string = "";

  public editedEmployee: boolean = false;

  constructor(private employeeService: EmployeeService, private taskService: TaskService, private http: HttpClient) { }

  ngOnInit(): void {
    this.employeeService.findAll().subscribe(res => {
      this.employeeList = res;
      this.filteredEmployeeList = this.employeeList.sort((a: any, b: any) => {
        const surnameComparison = a.surname.localeCompare(b.surname);
        if (surnameComparison !== 0) {
          return surnameComparison;
        }
        return a.name.localeCompare(b.name);
      });
      this.loadingFlag = false;
    }, err => {
      this.loadingFlag = false;
    });

    this.taskService.findAllCategories().subscribe(res => {
      this.taskCategories = res;
      for (let i = 1; i <= 4; i++) {
        this.taskService.findByCategory(i).subscribe(res => {
          this.taskCategories[i-1].tasks = res
          // if (!this.loadingFlag2) {
          //   this.loadingFlag = false;
            // this.handleEmployee(this.employeeList[0])
          // } else {
            this.loadingFlag2 = false;
          // }
        })
      }
    }, err => {
      this.loadingFlag2 = false;
    })
  }

  handleEmployee(employee: any) {
    this.editedEmployee = false;
    if (!this.loadingFlag&&!this.loadingFlag2&&!this.loadingForm&&!this.loadingSearch) {
      this.activeEmployee = employee;
      this.nameInputValue = employee.name;
      this.surnameInputValue = employee.surname;
      this.phoneInputValue = employee.phone || null;
      this.genderInputValue = employee.gender.name;
      if (employee.tutor) {
        this.tutorInputValue = employee.tutor.id || 0;
      } else {
        this.tutorInputValue = "0";
      }
      for (let task of employee.tasks) {
        this.checkedTasks = employee.tasks.map((task: any) => task.id);
        this.updateTaskCheckboxes();
      }
      this.editingEmployee = false;
      this.creatingEmployee = false;
      this.formError = false;
    }
  }

  updateTaskCheckboxes() {
    for (let taskCategory of this.taskCategories) {
      for (let task of taskCategory.tasks) {
        task.checked = this.checkedTasks.includes(task.id);
      }
    }
  }

  handleTask(id: number) {
    if (this.checkedTasks.find(task => task == id)) {
      this.checkedTasks = this.checkedTasks.filter(task => task != id);
    } else {
      this.checkedTasks.push(id);
    }
  }

  handleSaveEmployeeButton() {
    const form: any = {
      "name": this.nameInputValue,
      "surname": this.surnameInputValue,
      "phone": this.phoneInputValue,
      "gender_id": this.genderInputValue == "Femenino" ? 1 : 2,
      "tutor_id": this.tutorInputValue == "0" ? null : this.tutorInputValue,
      "tasks_ids": this.checkedTasks
    }

    if (this.nameInputValue != ""
      && this.surnameInputValue != ""
      && this.genderInputValue != ""
      && this.tutorInputValue != ""
      && this.checkedTasks.length > 0) {
      this.formError = false;
      if (!this.activeEmployee) {
        this.employeeService.create(form).subscribe(res => {
          this.employeeList.push(res);
          this.filteredEmployeeList = this.employeeList;
          this.loadingForm = false;
          this.handleEmployee(this.employeeList[this.employeeList.length - 1]);
          this.filteredEmployeeList = this.filteredEmployeeList.sort((a: any, b: any) => {
            const surnameComparison = a.surname.localeCompare(b.surname);
            if (surnameComparison !== 0) {
              return surnameComparison;
            }
            return a.name.localeCompare(b.name);
          });
        }, err => {
          this.loadingForm = false;
          this.formError = true;
          this.errorMessage = err.error.message;
        })
      } else {
        form.id = this.activeEmployee.id;
        this.employeeService.edit(form).subscribe(res => {
          let index = this.employeeList.findIndex((employee: any) => employee.id == this.activeEmployee.id);
          this.employeeList[index] = res;
          this.activeEmployee = res;
          this.loadingForm = false;
          this.handleEmployee(this.activeEmployee);
          this.filteredEmployeeList = this.filteredEmployeeList.sort((a: any, b: any) => {
            const surnameComparison = a.surname.localeCompare(b.surname);
            if (surnameComparison !== 0) {
              return surnameComparison;
            }
            return a.name.localeCompare(b.name);
          });
          this.editedEmployee = true;
        }, err => {
          this.loadingForm = false;
          this.formError = true;
          this.errorMessage = err.error.message;
        })
      }
      this.loadingForm = true;
    } else {
      this.formError = true;
      this.errorMessage = "Complete los campos obligatorios (*) y seleccione al menos una tarea."
    }
  }

  handleEditButton() {
    this.editedEmployee = false;
    this.editingEmployee = true;    
  }

  handleCreateButton() {
    this.editedEmployee = false;
    if (!this.loadingFlag&&!this.loadingFlag2&&!this.loadingForm) {
      this.nameInputValue = "";
      this.surnameInputValue = "";
      this.phoneInputValue = null;
      this.genderInputValue = "";
      this.tutorInputValue = "";
      this.checkedTasks = [];
      this.updateTaskCheckboxes();
      this.creatingEmployee = true;
      this.activeEmployee = null;
    }
  }

  handleDeleteButton() {
    this.editedEmployee = false;
    if (!this.loadingFlag&&!this.loadingFlag2&&!this.loadingForm) {
      this.loadingFlag = true;
      this.employeeService.delete(this.activeEmployee.id).subscribe(res => {
        this.loadingFlag = false;
      }, err => {
        this.loadingFlag = false;
        if (err.error.message == 'Cannot invoke "java.util.Optional.get()" because "deletedEmployee" is null') {
          let index = this.employeeList.findIndex((employee: any) => employee.id == this.activeEmployee.id);
          this.employeeList.splice(index, 1);
          this.filteredEmployeeList = this.employeeList;
          this.activeEmployee = null;
          this.nameInputValue = "";
          this.surnameInputValue = "";
          this.phoneInputValue = null;
          this.genderInputValue = "";
          this.tutorInputValue = "";
          this.checkedTasks = [];
          this.updateTaskCheckboxes();
          this.activeEmployee = null;
        } else {
          this.formError = true;
          this.errorMessage = err.error.message;
        }
        console.error(err);
      })
    }
  }

  onNameSearchInputChange() {
    this.editedEmployee = false;
    this.searchError = false;
    if (this.searchByNameInputValue != "") {
      this.searchBySurnameInputValue = "";
      this.loadingSearch = true
      this.employeeService.searchByName(this.searchByNameInputValue).subscribe(res => {
        this.loadingSearch = false;
        this.filteredEmployeeList = res;
        this.filteredEmployeeList = this.filteredEmployeeList.sort((a: any, b: any) => {
          const surnameComparison = a.surname.localeCompare(b.surname);
          if (surnameComparison !== 0) {
            return surnameComparison;
          }
          return a.name.localeCompare(b.name);
        });
      }, err => {
        this.loadingSearch = false;
        this.searchError = true;
        this.searchErrorMessage = err.error.message;
        this.filteredEmployeeList = [];
      })
    } else {
      this.searchError = false
      this.filteredEmployeeList = this.employeeList;
    }
  }
  onSurnameSearchInputChange() {
    this.editedEmployee = false;
    this.searchError = false;
    if (this.searchBySurnameInputValue != "") {
      this.searchByNameInputValue = "";
      this.loadingSearch = true
      this.employeeService.searchBySurname(this.searchBySurnameInputValue).subscribe(res => {
        this.loadingSearch = false;
        this.filteredEmployeeList = res;
        this.filteredEmployeeList = this.filteredEmployeeList.sort((a: any, b: any) => {
          const surnameComparison = a.surname.localeCompare(b.surname);
          if (surnameComparison !== 0) {
            return surnameComparison;
          }
          return a.name.localeCompare(b.name);
        });
      }, err => {
        this.loadingSearch = false;
        this.searchError = true;
        this.searchErrorMessage = err.error.message;
        this.filteredEmployeeList = [];
      })
    } else {
      this.searchError = false
      this.filteredEmployeeList = this.employeeList;
    }
  }
}