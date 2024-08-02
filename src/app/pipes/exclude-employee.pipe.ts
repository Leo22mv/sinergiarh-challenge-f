import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeEmployee'
})
export class ExcludeEmployeePipe implements PipeTransform {
  transform(employees: any[], excludedId: number): any[] {
    return employees.filter(employee => employee.id !== excludedId);
  }
}