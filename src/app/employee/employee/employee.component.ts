import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaisseService } from 'src/app/service/caisse.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  currentsearch = '';
  allEmployees = [];
  changeForm = '';
  payToAdd: Number;
  theDescription = '';
  userLogedIn: any = { role: 'USER' };
  searchUser = null;
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private caisseService: CaisseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN' &&
        this.userLogedIn.role !== 'USER'
      ) {
        this.router.navigate(['/']);
      } else {
        this.employeeService.getEmployees().subscribe((employees: any) => {
          this.allEmployees = employees;
          console.log(employees);
        });
      }
    });
  }
  deleteEmployee(id) {
    this.employeeService.deleteEmployee(id).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }
  salarysLength(data) {
    let arr = [];
    arr = data;
    return arr.length - 1;
  }
  change(id) {
    this.changeForm = id;
  }
  abCredit(data) {
    let arr = [];
    arr = data;
    let credit = 0;
    arr.map((el) => {
      credit += el.rest;
    });
    return credit;
  }
  abLength(data) {
    let arr = [];
    arr = data;
    return arr.length;
  }
  addAvance(emp) {
    let nowDate = new Date();
    let newAvance = {
      date: nowDate,
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      amount: this.payToAdd,
    };

    let idSalary = emp.salarys[emp.salarys.length - 1].id;
    this.employeeService
      .addAvance(emp.id, newAvance, idSalary)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          let newOutcome = {
            date: nowDate,
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            day: nowDate.getDate(),
            amount: this.payToAdd,
            description: this.theDescription,
            employee: emp.fullName,
            avanceId: data.avanceId,
          };
          console.error(data.avanceId);
          console.error(newOutcome);
          alert("l'avance a été ajoutée");
          this.caisseService.addOutcome(newOutcome).subscribe((data: any) => {
            if (data.msg !== 'OK') {
              alert(data.msg);
            } else {
              alert('le payement a été enregistré');
              location.reload();
            }
          });
        }
      });
    this.change('');
  }
}
