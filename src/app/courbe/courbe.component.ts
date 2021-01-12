import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbonneService } from '../service/abonne.service';
import { CaisseService } from '../service/caisse.service';
import { EmployeeService } from '../service/employee.service';
import { UserService } from '../service/user.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-courbe',
  templateUrl: './courbe.component.html',
  styleUrls: ['./courbe.component.css'],
})
export class CourbeComponent implements OnInit {
  currentsearchMonth = new Date().getMonth() + 1;
  currentsearchYear = new Date().getFullYear();
  currentsearchDepartement = 'Tout';
  currentsearchEmployee = '';
  currentsearchDay = 0;
  userLogedIn: any = { role: 'USER' };
  allEmployeeName = [];
  formChange = 'TOUT';
  allAbonnements = [];
  allEmployees = [];
  allOutcomes = [];
  allIncomes = [];
  allFilterdOutcomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdIncomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdAbonnement = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdAbonnementSansSeance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdAbonnementSeance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdAbonnementIncomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdAbonnementCredit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdSalarys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  allFilterdNumberOfAvances = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
              let month = new Date(ele.date).getMonth();
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
  public Tout: any = {
    Chart: {
      type: 'area',
      height: 700,
    },
    title: {
      text: this.formChange,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Income',
        data: this.allFilterdIncomes,
      },
      {
        name: 'Outcome',
        data: this.allFilterdOutcomes,
      },
      {
        name: "Abonnement's number",
        data: this.allFilterdAbonnement,
      },
      {
        name: "Abonnement's income",
        data: this.allFilterdAbonnementIncomes,
      },
      {
        name: "Abonnement's credit",
        data: this.allFilterdAbonnementCredit,
      },
      {
        name: 'salary',
        data: this.allFilterdSalarys,
      },
      {
        name: "avance's number",
        data: this.allFilterdNumberOfAvances,
      },
    ],
  };
  public EMPLOYEE: any = {
    Chart: {
      type: 'area',
      height: 700,
    },
    title: {
      text: 'EMPLOYEE',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'salary',
        data: this.allFilterdSalarys,
      },
      {
        name: "avance's number",
        data: this.allFilterdNumberOfAvances,
      },
    ],
  };
  public ABONNEMENTS: any = {
    Chart: {
      type: 'area',
      height: 700,
    },
    title: {
      text: 'ABONNEMENTS',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    series: [
      {
        name: "Abonnement's number",
        data: this.allFilterdAbonnement,
      },
      {
        name: "Abonnement's income",
        data: this.allFilterdAbonnementIncomes,
      },
      {
        name: 'Abonnements sans Seance',
        data: this.allFilterdAbonnementSansSeance,
      },
      {
        name: 'Abonnements seance',
        data: this.allFilterdAbonnementSeance,
      },
      {
        name: "Abonnement's credit",
        data: this.allFilterdAbonnementCredit,
      },
    ],
  };
  public INOUTCOME: any = {
    Chart: {
      type: 'area',
      height: 700,
    },
    title: {
      text: 'INOUTCOME',
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      tickmarkPlacement: 'on',
      title: {
        enabled: false,
      },
    },
    series: [
      {
        name: 'Income',
        data: this.allFilterdIncomes,
      },
      {
        name: 'Outcome',
        data: this.allFilterdOutcomes,
      },
    ],
  };
  changeform(data) {
    if (data === 'TOUT') {
      this.allIncomes.map((el) => {
        if (
          new Date(el.date).getMonth() &&
          new Date(el.date).getFullYear() == this.currentsearchYear
        ) {
          this.allFilterdIncomes[new Date(el.date).getMonth()] += el.amount;
        }
      });
      this.allOutcomes.map((el) => {
        if (
          new Date(el.date).getMonth() &&
          new Date(el.date).getFullYear() == this.currentsearchYear
        ) {
          this.allFilterdOutcomes[new Date(el.date).getMonth()] += el.amount;
        }
      });
      this.allAbonnements.map((el) => {
        if (el.month && el.year == this.currentsearchYear) {
          if (el.pay > 5) {
            this.allFilterdAbonnementSansSeance[el.month] += 1;
          }
          if ((el.pay <= 5 && el.pay > 1) || el.fullName == 'seance seance') {
            this.allFilterdAbonnementSeance[el.month] += 1;
          }
          this.allFilterdAbonnement[el.month] += 1;
          this.allFilterdAbonnementIncomes[el.month] += el.pay;
          this.allFilterdAbonnementCredit[el.month] += el.price - el.pay;
        }
      });
      this.allEmployees.map((el) => {
        if (el.month && el.year == this.currentsearchYear) {
          this.allFilterdSalarys[el.month - 1] += el.salary;
          this.allFilterdNumberOfAvances[el.month - 1] += el.numberOfAvances;
        }
      });
    }
    Highcharts.chart('EMPLOYEE', this.EMPLOYEE);
    Highcharts.chart('ABONNEMENTS', this.ABONNEMENTS);
    Highcharts.chart('INOUTCOME', this.INOUTCOME);
    Highcharts.chart('TOUT', this.Tout);
    this.allFilterdOutcomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdIncomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdAbonnementSansSeance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdAbonnementSeance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdAbonnement = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdAbonnementIncomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdAbonnementCredit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdSalarys = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.allFilterdNumberOfAvances = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
}
