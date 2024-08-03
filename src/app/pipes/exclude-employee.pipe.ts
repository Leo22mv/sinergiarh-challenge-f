import { Pipe, PipeTransform } from '@angular/core';

// Pipe utilizado para excluir de la lista de selección de tutores al empleado que se está editando

@Pipe({
  name: 'excludeEmployee'
})
export class ExcludeEmployeePipe implements PipeTransform {
  transform(employees: any[], excludedId: number): any[] {
    return employees.filter(employee => employee.id !== excludedId);
  }
}