import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CaisseService } from 'src/app/service/caisse.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.css'],
})
export class CaisseComponent implements OnInit {
  currentsearch = '';
  allIncomes = [];
  allOutcomes = [];
  nowYear = new Date().getFullYear();
  currentsearchYear = this.nowYear;
  nowMonth = new Date().getMonth() + 1;
  currentsearchMonth = this.nowMonth;
  nowDay = new Date().getDate();
  currentsearchDay = this.nowDay;
  changeForm = '';
  userLogedIn: any = { role: 'USER' };
  searchDate: Date = new Date();
  constructor(
    private userService: UserService,
    private caisseService: CaisseService,
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
        this.caisseService.getIncome().subscribe((income: any) => {
          this.allIncomes = income;
        });
        this.caisseService.getOutcome().subscribe((outcome: any) => {
          this.allOutcomes = outcome;
        });
      }
    });
  }
  deleteIncome(id) {
    this.caisseService.deleteIncome(id).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }

  deleteOutcome(id) {
    this.caisseService.deleteOutcome(id).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }

  change(val) {
    this.changeForm = val;
  }

  calcul(data: any) {
    let val = 0;
    data.map((el) => (val += el.amount));
    return val;
  }
  searchByDate(dateserch: Date) {
    if (dateserch || dateserch !== null) {
      this.searchDate = dateserch;
    } else {
      this.searchDate = null;
    }
  }
}
