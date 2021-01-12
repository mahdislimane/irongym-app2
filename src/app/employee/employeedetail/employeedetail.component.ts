import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee } from 'src/app/model/employee.model';
import { CaisseService } from 'src/app/service/caisse.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-employeedetail',
  templateUrl: './employeedetail.component.html',
  styleUrls: ['./employeedetail.component.css'],
})
export class EmployeedetailComponent implements OnInit {
  currentEmployee;
  currentsearchMonth;
  currentsearchYear;
  theDescription = '';
  changeForm = '';
  avanceToAdd: Number;
  allSalarys = [];
  userLogedIn: any = { role: '' };
  createFormForSearch = this.fb.group({
    year: [null],
    month: [null],
  });
  createForm = this.fb.group({
    id: [],
    salary: [null, Validators.required],
    year: [null, Validators.required],
    month: [null, Validators.required],
    dayCoast: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService,
    private caisseService: CaisseService,
    private router: Router,
    private route: ActivatedRoute
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
        this.employeeService
          .getSelectedEmployee(this.route.snapshot.params['id'])
          .subscribe((employee: IEmployee) => {
            this.currentEmployee = employee;
            this.allSalarys = this.currentEmployee.salarys;
          });
      }
    });
  }
  deleteSalarys(id, ids) {
    this.employeeService.deleteSalary(id, ids).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }

  deleteAvance(ids) {
    this.employeeService
      .deleteAvance(this.currentEmployee.id, ids)
      .subscribe((data: any) => {
        alert(data.msg);
        location.reload();
      });
  }

  addSalary(id) {
    this.employeeService
      .addSalary(id, this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert('Le salaire a été ajouté avec succés');
          this.change('');
          location.reload();
        }
      });
  }
  change(id) {
    this.changeForm = id;
  }
  checkMonth(num: number) {
    if (num === 1) {
      return 'JANVIER';
    } else if (num === 2) {
      return 'FEVRIER';
    } else if (num === 3) {
      return 'MARS';
    } else if (num === 4) {
      return 'AVRIL';
    } else if (num === 5) {
      return 'MAI';
    } else if (num === 6) {
      return 'JUIN';
    } else if (num === 7) {
      return 'JUILLET';
    } else if (num === 8) {
      return 'AOUT';
    } else if (num === 9) {
      return 'SEPTEMBRE';
    } else if (num === 10) {
      return 'OCTOBRE';
    } else if (num === 11) {
      return 'NOVEMBRE';
    } else if (num === 12) {
      return 'DECEMBRE';
    }
  }
  addAvance(salary) {
    let nowDate = new Date();
    let newAvance = {
      date: nowDate,
      year: salary.year,
      month: salary.month,
      amount: this.avanceToAdd,
    };
    this.employeeService
      .addAvance(this.currentEmployee.id, newAvance, salary.id)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          let newOutcome = {
            date: nowDate,
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            day: nowDate.getDate(),
            amount: this.avanceToAdd,
            description: this.theDescription,
            employee: this.currentEmployee.fullName,
            avanceId: data.avanceId,
          };
          alert("L'avance a été enregistrée avec succées");
          this.caisseService.addOutcome(newOutcome).subscribe((data: any) => {
            if (data.msg !== 'OK') {
              alert(data.msg);
            } else {
              alert('le payement a été enregistré avec succés');
              location.reload();
            }
          });
        }
      });
  }
  dayoffPlus(dat, ida) {
    let data = {
      dayState: dat,
    };
    this.employeeService
      .editDayoff(this.currentEmployee.id, data, ida)
      .subscribe((recData: any) => {
        if (recData.msg !== 'OK') {
          alert(recData.msg);
        } else {
          alert('le salaire a été modifier avec succés');
          location.reload();
        }
      });
  }
  checkEntMoy(data) {
    let entryHistoryByDay = [];
    if (data.entryHistory[0]) {
      data.entryHistory.map((elem) => {
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
      });
    }
    let ind = 0;
    let moyEntryHour: any = 0;
    let moyEntryMinute: any = 0;
    if (entryHistoryByDay[0]) {
      entryHistoryByDay?.map((ele, i) => {
        if (ele[0]?.entryDate) {
          moyEntryHour += new Date(ele[0]?.entryDate).getHours();
          moyEntryMinute += new Date(ele[0]?.entryDate).getMinutes();
          ind = (i + 1) / 2;
        }
      });
      moyEntryHour = moyEntryHour / ind;
      moyEntryMinute = moyEntryMinute / ind;
    }
    let x = moyEntryHour - Math.floor(moyEntryHour);
    if ((moyEntryMinute + 60) * x >= 60) {
      moyEntryHour = Math.floor(moyEntryHour) + 1;
      moyEntryMinute = (moyEntryMinute + 60) * x - 60;
    } else {
      moyEntryHour = Math.floor(moyEntryHour);
      moyEntryMinute = (moyEntryMinute + 60) * x;
    }
    return (
      Math.floor(moyEntryHour) + 'h et ' + Math.floor(moyEntryMinute) + 'm'
    );
  }
  checkSorMoy(data) {
    let entryHistoryByDay = [];
    if (data.entryHistory[0]) {
      data.entryHistory.map((elem) => {
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
      });
    }
    let ind = 0;
    let moyExitHour: any = 0;
    let moyExitMinute: any = 0;
    if (entryHistoryByDay[0]) {
      entryHistoryByDay?.map((ele, i) => {
        if (ele[0]?.entryDate) {
          if (ele[ele.length - 1]?.exitDate) {
            moyExitHour += new Date(ele[ele.length - 1]?.exitDate).getHours();
            moyExitMinute += new Date(
              ele[ele.length - 1]?.exitDate
            ).getMinutes();
          } else if (ele[ele.length - 2]?.exitDate) {
            moyExitHour += new Date(ele[ele.length - 2]?.exitDate).getHours();
            moyExitMinute += new Date(
              ele[ele.length - 2]?.exitDate
            ).getMinutes();
          }
          ind = (i + 1) / 2;
        }
      });
      moyExitHour = moyExitHour / ind;
      moyExitMinute = moyExitMinute / ind;
    }
    let x = moyExitHour - Math.floor(moyExitHour);
    if (moyExitMinute + 60 * x >= 60) {
      moyExitHour = Math.floor(moyExitHour) + 1;
      moyExitMinute = moyExitMinute + 60 * x - 60;
    } else {
      moyExitHour = Math.floor(moyExitHour);
      moyExitMinute = moyExitMinute + 60 * x;
    }
    return Math.floor(moyExitHour) + 'h et ' + Math.floor(moyExitMinute) + 'm';
  }
  checkResMoy(data) {
    let entryHistoryByDay = [];
    if (data.entryHistory) {
      data.entryHistory.map((elem) => {
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
      });
    }
    let ind = 0;
    let moyRestTime: any = 0;
    entryHistoryByDay.map((ele, i) => {
      if (ele[0].entryDate) {
        ele.map((elem) => {
          if (elem.exitDate) {
            moyRestTime +=
              new Date(elem.exitDate).valueOf() -
              new Date(elem.entryDate).valueOf();
          } else {
            moyRestTime +=
              new Date().valueOf() - new Date(elem.entryDate).valueOf();
          }
        });
        ind = (i + 1) / 2;
      }
    });
    if (ind !== 0) {
      moyRestTime = moyRestTime / ind;
    }
    let hour = moyRestTime / 3600000;
    let minut = (moyRestTime - Math.floor(hour) * 3600000) / 60000;
    return Math.floor(hour) + 'h et ' + Math.floor(minut) + 'm';
  }
}
