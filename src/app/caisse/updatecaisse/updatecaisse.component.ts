import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbonneService } from 'src/app/service/abonne.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-updatecaisse',
  templateUrl: './updatecaisse.component.html',
  styleUrls: ['./updatecaisse.component.css'],
})
export class UpdatecaisseComponent implements OnInit {
  currentsearch = '';
  allAbonnements = [];
  searchDate: Date = new Date();
  changeForm = '';
  searchCredit = 'Tout';
  userLogedIn: any = { role: 'USER' };
  currentsearchMonth = new Date().getMonth() + 1;
  currentsearchYear = new Date().getFullYear();
  currentsearchDay = new Date().getDate();
  currentsearchDepartement = 'Tout';
  constructor(
    private userService: UserService,
    private abonneService: AbonneService,
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
              let abon = {
                idAbonne: el.id,
                idAbonnement: ele.id,
                fullName: el.firstName + ' ' + el.lastName,
                credit: el.credit,
                departement: ele.departement,
                type: ele.abType,
                price: ele.price,
                pay: ele.pay,
                date: ele.date,
                presences: ele.presences,
                userLogedIn: el.userLogedIn,
              };
              this.allAbonnements.push(abon);
            });
          });
        });
      }
    });
  }
  deleteAbonnement(id, ida) {
    this.abonneService.deleteAbonnement(id, ida).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }
  checkCredit(data) {
    this.searchCredit = data;
    if (data === 'abonnements' || data === 'presence') {
      this.currentsearchDay = new Date().getDate();
    } else {
      this.currentsearchDay = 0;
    }
  }
  abLength(data) {
    let arr = [];
    arr = data;
    return arr.length;
  }
  abCredit(data) {
    let arr = [];
    arr = data;
    let credit = 0;
    arr.map((el) => {
      credit += el.credit;
    });
    return credit;
  }
  abPay(data) {
    let arr = [];
    arr = data;
    let pay = 0;
    arr.map((el) => {
      pay += el.pay;
    });
    return pay;
  }
}
