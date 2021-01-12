import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'statFilter',
})
export class StatPipe implements PipeTransform {
  transform(
    value: any,
    departement?: any,
    year?: any,
    month?: any,
    employee?: any
  ): any {
    return value.filter((val) => {
      let rVal;
      if (departement === 'Tout') {
        if (employee === 'Tout les employées') {
          rVal = val.year == year && val.month == month;
        } else {
          rVal =
            val.year == year && val.month == month && val.fullName == employee;
        }
      } else if (departement !== 'Tout') {
        if (employee === 'Tout les employées') {
          rVal =
            val.year == year &&
            val.month == month &&
            val.departement == departement;
        } else {
          rVal =
            val.year == year &&
            val.month == month &&
            val.departement == departement &&
            val.fullName == employee;
        }
      } else {
        rVal = val;
      }
      return rVal;
    });
  }
}
