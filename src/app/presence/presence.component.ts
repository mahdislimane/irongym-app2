import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbonneService } from '../service/abonne.service';
import { CaisseService } from '../service/caisse.service';
import { EmployeeService } from '../service/employee.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.css'],
})
export class PresenceComponent implements OnInit {
  allAbonnements = [];
  allEmployees = [];
  allOutcomes = [];
  allIncomes = [];
  allEmployeeName = [];
  formChange = 'TOUT';
  userLogedIn: any = { role: 'USER' };
  currentsearchMonth = new Date().getMonth() + 1;
  currentsearchYear = new Date().getFullYear();
  currentsearchDepartement = 'Tout';
  currentsearchEmployee = '';
  currentsearchDay = 0;
  moyDaily = false;
  constructor(
    private userService: UserService,
    private abonneService: AbonneService,
    private caisseService: CaisseService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN'
      ) {
        this.router.navigate(['/']);
      } else {
        this.abonneService.fetchAbonnes().subscribe((abonne: any[]) => {
          abonne.map((el) => {
            el.abonnements.map((ele) => {
              let month = new Date(ele.date).getMonth() + 1;
              let year = new Date(ele.date).getFullYear();
              let abon = {
                idAbonne: el.id,
                idAbonnement: ele.id,
                fullName: el.firstName + ' ' + el.lastName,
                credit: el.credit,
                departement: ele.departement,
                type: ele.abType,
                price: ele.price,
                pay: ele.pay,
                month: month,
                year: year,
                presences: ele.presences,
                userLogedIn: el.userLogedIn,
              };
              this.allAbonnements.push(abon);
            });
          });
        });
        this.employeeService.getEmployees().subscribe((data: any[]) => {
          let employe = data;
          employe.map((el) => {
            this.allEmployeeName.push(el.fullName);
            el.salarys.map((ele) => {
              let totalAvances = 0;
              let numberOfAvances = 0;
              ele.avances.map((elem) => {
                if (elem.amount) {
                  numberOfAvances += 1;
                  totalAvances += elem.amount;
                }
              });
              let entryHistoryByDay = [];
              let moyEnterHour: number = 0;
              let moyEnterMinute: number = 0;
              let numberEnter: number = 0;
              let numberExit: number = 0;
              let moyExitHour: number = 0;
              let moyExitMinute: number = 0;
              let moyHourSpend: number = 0;
              let moyMinuteSpend: number = 0;
              if (ele.entryHistory) {
                ele.entryHistory.map((elem) => {
                  let entdat: any =
                    new Date(elem.entryDate).getFullYear() +
                    '/' +
                    (new Date(elem.entryDate).getMonth() + 1) +
                    '/' +
                    new Date(elem.entryDate).getDate();
                  let testI = 0;
                  entryHistoryByDay.map((elemen, i) => {
                    if (elemen == entdat) {
                      entryHistoryByDay[i + 1].push(elem);
                    } else {
                      testI += 1;
                    }
                  });
                  if (testI == entryHistoryByDay.length) {
                    entryHistoryByDay.push(entdat);
                    entryHistoryByDay.push([elem]);
                  }
                  if (elem.entryDate) {
                    moyEnterHour += new Date(elem.entryDate).getHours();
                    moyEnterMinute += new Date(elem.entryDate).getMinutes();
                    numberEnter += 1;
                  }
                  if (elem.exitDate) {
                    moyExitHour += new Date(elem.exitDate).getHours();
                    moyExitMinute += new Date(elem.exitDate).getMinutes();
                    numberExit += 1;
                  }
                });
              }
              if (numberEnter !== 0 && numberExit !== 0) {
                moyEnterHour = moyEnterHour / numberEnter;
                moyExitHour = moyExitHour / numberExit;
                moyEnterMinute = moyEnterMinute / numberEnter;
                moyExitMinute = moyExitMinute / numberExit;
                if (moyExitMinute - moyEnterMinute > 0) {
                  moyHourSpend = moyExitHour - moyEnterHour;
                  moyMinuteSpend = moyExitMinute - moyEnterMinute;
                } else if (moyExitMinute - moyEnterMinute < 0) {
                  moyHourSpend = moyExitHour - moyEnterHour - 1;
                  moyMinuteSpend = moyExitMinute - moyEnterMinute + 60;
                }
              }
              let emp = {
                idEmployee: el.id,
                idSalary: ele.id,
                fullName: el.fullName,
                departement: el.jobTitle,
                phoneNumber: el.phoneNumber,
                cardNumber: el.cardNumber,
                cardNumber2: el.cardNumber2,
                cin: el.cin,
                startDate: el.startDate,
                endDate: el.endDate,
                rest: el.rest,
                salary: ele.salary,
                year: ele.year,
                month: ele.month,
                avances: totalAvances,
                entryHistory: ele.entryHistory,
                entryHistoryByDay: entryHistoryByDay,
                numberOfAvances: numberOfAvances,
                numberExit: numberExit,
                numberEnter: numberEnter,
                moyMinuteSpend: moyMinuteSpend,
                moyHourSpend: moyHourSpend,
                moyExitMinute: moyExitMinute,
                moyExitHour: moyExitHour,
                moyEnterMinute: moyEnterMinute,
                moyEnterHour: moyEnterHour,
              };
              this.allEmployees.push(emp);
            });
          });
        });
        this.caisseService.getIncome().subscribe((income: any) => {
          this.allIncomes = income;
        });
        this.caisseService.getOutcome().subscribe((outcome: any) => {
          this.allOutcomes = outcome;
        });
      }
    });
  }

  changeMoyDaily() {
    if (
      this.moyDaily == false &&
      this.currentsearchEmployee == 'Tout les employées'
    ) {
      this.currentsearchEmployee = this.allEmployeeName[0];
    }
    this.moyDaily = !this.moyDaily;
  }

  checktimeDep(ent, ext) {
    let moyH: any = 0;
    let moyM: any = 0;
    if (ent && ext) {
      moyH = new Date(ext).getHours() - new Date(ent).getHours();
      moyM = new Date(ext).getMinutes() - new Date(ent).getMinutes();
      if (moyM < 0) {
        moyH = moyH - 1;
        moyM = moyM + 60;
      }
    } else {
      moyH = new Date().getHours() - new Date(ent).getHours();
      moyM = new Date().getMinutes() - new Date(ent).getMinutes();
      if (moyM < 0) {
        moyH = moyH - 1;
        moyM = moyM + 60;
      }
    }
    return moyH + 'h et ' + moyM + 'm';
  }

  calcul(data: any) {
    let val = 0;
    data.map((el) => (val += el.amount));
    return val;
  }
  checkSalary(data: any[]) {
    let sal = 0;
    data.map((el) => {
      sal += el.salary;
    });
    return sal;
  }
  checkAvance(data: any[]) {
    let av = 0;
    data.map((el) => {
      av += el.avances;
    });
    return av;
  }
  checkNumberOfAvance(data: any[]) {
    let av = 0;
    data.map((el) => {
      av += el.numberOfAvances;
    });
    return av;
  }
  checkAbonnement(data: any[]) {
    let ab = 0;
    ab = data.length;
    return ab;
  }
  checkMoyEntry(data: any[]) {
    let moyEntryHourAll: any = 0;
    let moyEntryMinuteAll: any = 0;
    let ind = 0;
    let indAll = 0;
    data.map((el) => {
      let moyEntryHour: any = 0;
      let moyEntryMinute: any = 0;
      if (el.entryHistoryByDay[1]) {
        indAll += 1;
      }
      if (el.entryHistoryByDay[0]) {
        el?.entryHistoryByDay?.map((ele, i) => {
          if (ele[0]?.entryDate) {
            moyEntryHour += new Date(ele[0]?.entryDate).getHours();
            moyEntryMinute += new Date(ele[0]?.entryDate).getMinutes();

            ind = (i + 1) / 2;
          }
        });
        moyEntryHour = moyEntryHour / ind;
        moyEntryMinute = moyEntryMinute / ind;
      }
      moyEntryHourAll += moyEntryHour;
      moyEntryMinuteAll += moyEntryMinute;
    });
    if (indAll !== 0) {
      moyEntryHourAll = moyEntryHourAll / indAll;
      moyEntryMinuteAll = moyEntryMinuteAll / indAll;
    }
    let x = moyEntryHourAll - Math.floor(moyEntryHourAll);
    if (moyEntryMinuteAll + 60 * x >= 60) {
      moyEntryHourAll = Math.floor(moyEntryHourAll) + 1;
      moyEntryMinuteAll = moyEntryMinuteAll + 60 * x - 60;
    } else {
      moyEntryHourAll = Math.floor(moyEntryHourAll);
      moyEntryMinuteAll = moyEntryMinuteAll + 60 * x;
    }
    return (
      Math.floor(moyEntryHourAll) +
      'h et ' +
      Math.floor(moyEntryMinuteAll) +
      'm'
    );
  }
  checkMoyExit(data: any[]) {
    let moyExitHourAll: any = 0;
    let moyExitMinuteAll: any = 0;
    let indAll = 0;
    data.map((el) => {
      let ind = 0;
      let moyExitHour: any = 0;
      let moyExitMinute: any = 0;
      if (el.entryHistoryByDay[1]) {
      }
      if (el.entryHistoryByDay[0]) {
        el?.entryHistoryByDay?.map((ele, i) => {
          if (ele[0]?.entryDate) {
            if (ele[ele.length - 1]?.exitDate) {
              moyExitHour += new Date(ele[ele.length - 1]?.exitDate).getHours();
              moyExitMinute += new Date(
                ele[ele.length - 1]?.exitDate
              ).getMinutes();
              ind = (i + 1) / 2;
            } else if (ele[ele.length - 2]?.exitDate) {
              moyExitHour += new Date(ele[ele.length - 2]?.exitDate).getHours();
              moyExitMinute += new Date(
                ele[ele.length - 2]?.exitDate
              ).getMinutes();
              ind = (i + 1) / 2;
            }
          }
        });
        if (ind !== 0) {
          moyExitHour = moyExitHour / ind;
          moyExitMinute = moyExitMinute / ind;
        }
        if (moyExitHour != 0 || moyExitMinute != 0) {
          moyExitHourAll += moyExitHour;
          moyExitMinuteAll += moyExitMinute;
          indAll += 1;
        }
      }
    });
    if (indAll !== 0) {
      moyExitHourAll = moyExitHourAll / indAll;
      moyExitMinuteAll = moyExitMinuteAll / indAll;
    }
    let x = moyExitHourAll - Math.floor(moyExitHourAll);
    if (moyExitMinuteAll + 60 * x >= 60) {
      moyExitHourAll = Math.floor(moyExitHourAll) + 1;
      moyExitMinuteAll = moyExitMinuteAll + 60 * x - 60;
    } else {
      moyExitHourAll = Math.floor(moyExitHourAll);
      moyExitMinuteAll = moyExitMinuteAll + 60 * x;
    }
    return (
      Math.floor(moyExitHourAll) + 'h et ' + Math.floor(moyExitMinuteAll) + 'm'
    );
  }
  checkMoyRest(data: any[]) {
    let moyRestTimeAll: any = 0;
    let ind = 0;
    let indAll = 0;
    data.map((el) => {
      let moyRestTime: any = 0;
      if (el.entryHistoryByDay[1]) {
      }
      el?.entryHistoryByDay.map((ele, i) => {
        let daylyRest: any = 0;
        if (ele[0].entryDate) {
          ele.map((elem) => {
            if (elem.exitDate) {
              daylyRest +=
                new Date(elem.exitDate).valueOf() -
                new Date(elem.entryDate).valueOf();
              ind = (i + 1) / 2;
            } else {
              daylyRest +=
                new Date().valueOf() - new Date(elem.entryDate).valueOf();
              ind = (i + 1) / 2;
            }
          });
          if (daylyRest != 0) {
            moyRestTime += daylyRest;
            ind = (i + 1) / 2;
          }
        }
      });
      if (ind != 0) {
        moyRestTime = moyRestTime / ind;
      }
      if (moyRestTime != 0) {
        indAll += 1;
        moyRestTimeAll += moyRestTime;
      }
    });
    if (indAll !== 0) {
      moyRestTimeAll = moyRestTimeAll / indAll;
    }
    let hour = moyRestTimeAll / 3600000;
    let minut = (moyRestTimeAll - Math.floor(hour) * 3600000) / 60000;
    return Math.floor(hour) + 'h et ' + Math.floor(minut) + 'm';
  }
  checkAbonne(data: any[]) {
    var cache = {};
    data = data.filter(function (elem, index, array) {
      return cache[elem.fullName] ? 0 : (cache[elem.fullName] = 1);
    });
    return data.length;
  }
  checkIncome(data: any[]) {
    let inc = 0;
    data.map((el) => {
      inc += el.pay;
    });
    return inc;
  }
  changeform(data) {
    if (data === 'EMPLOYEE') {
      this.currentsearchDepartement = 'Tout';
    } else {
      this.currentsearchDepartement = 'Tout';
      this.currentsearchEmployee = 'Tout les employées';
      this.moyDaily = false;
    }
    this.formChange = data;
    this.moyDaily = false;
  }
  checkPresence(data) {
    let pre = 0;
    data.map((el) => {
      pre += el.presences.length;
    });
    return pre;
  }
  checkMoyPresence(data) {
    let pre = 0;
    let moy = 0;
    data.map((el) => {
      pre += el.presences.length;
    });
    if (new Date().getMonth() + 1 == data[0]?.month) {
      moy = pre / new Date().getDate();
    } else if (
      data[0]?.month == 1 ||
      data[0]?.month == 3 ||
      data[0]?.month == 5 ||
      data[0]?.month == 7 ||
      data[0]?.month == 8 ||
      data[0]?.month == 10 ||
      data[0]?.month == 12
    ) {
      moy = pre / 31;
    } else if (data[0]?.month == 2) {
      moy = pre / 28;
    } else {
      moy = pre / 30;
    }
    return moy.toFixed(2);
  }
}
