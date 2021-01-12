import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerFilter',
})
export class SearchPipe implements PipeTransform {
  transform(
    value: any,
    args?: any,
    args2?: any,
    args3?: any,
    args4?: any
  ): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal;
      if (val.firstName && val.lastName) {
        if (args2 === '0+01234') {
          rVal = val.userLogedIn
            .toLocaleLowerCase()
            .includes(args.toLocaleLowerCase());
        } else {
          rVal =
            val.firstName
              .toLocaleLowerCase()
              .includes(args.toLocaleLowerCase()) ||
            val.lastName.toLocaleLowerCase().includes(args.toLocaleLowerCase());
        }
      } else if (val.fullName) {
        rVal = val.fullName
          .toLocaleLowerCase()
          .includes(args.toLocaleLowerCase());
      } else if (val.month && !val.day) {
        rVal = val.month == args && val.year === args2;
      } else if (val.month && val.day) {
        if (args3 === 0) {
          rVal = val.month == args && val.year === args2;
        } else if (args4) {
          rVal =
            new Date(val.date).getDate() == new Date(args4).getDate() &&
            new Date(val.date).getMonth() == new Date(args4).getMonth() &&
            new Date(val.date).getFullYear() == new Date(args4).getFullYear();
        } else {
          rVal = val.month == args && val.year === args2 && val.day === args3;
        }
      }
      return rVal;
    });
  }
}
