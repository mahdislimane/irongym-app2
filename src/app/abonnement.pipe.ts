import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'abonnementFilter',
})
export class AbonnementPipe implements PipeTransform {
  transform(
    value: any,
    year?: any,
    month?: any,
    day?: any,
    search?: any,
    departement?: any,
    check?: any
  ): any {
    if (!year) {
      return value;
    }

    return value.filter((val) => {
      let rVal = val;
      if (check === 'creditMois') {
        if (departement === 'Tout') {
          rVal =
            val.credit > 0 &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month;
        } else {
          rVal =
            val.credit > 0 &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month &&
            val.departement === departement;
        }
      } else if (check === 'abonnements') {
        if (departement === 'Tout') {
          rVal =
            val.fullName
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month &&
            new Date(val.date).getDate() == day;
        } else {
          rVal =
            val.fullName
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month &&
            new Date(val.date).getDate() == day &&
            val.departement === departement;
        }
      } else if (check === 'abonnementsMois') {
        if (departement === 'Tout') {
          rVal =
            val.fullName
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month;
        } else {
          rVal =
            val.fullName
              .toLocaleLowerCase()
              .includes(search.toLocaleLowerCase()) &&
            new Date(val.date).getFullYear() == year &&
            new Date(val.date).getMonth() + 1 == month &&
            val.departement == departement;
        }
      } else if (check === 'presence') {
        let test = false;
        val.presences.map((elemen) => {
          if (
            new Date(elemen.date).getFullYear() == year &&
            new Date(elemen.date).getMonth() + 1 == month &&
            new Date(elemen.date).getDate() == day
          ) {
            test = true;
          }
        });
        if (departement === 'Tout') {
          rVal = test;
        } else {
          rVal = test && val.departement == departement;
        }
      }
      return rVal;
    });
  }
}
