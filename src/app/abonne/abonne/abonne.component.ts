import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAbonnement } from 'src/app/model/abonnement.model';
import { AbonneService } from 'src/app/service/abonne.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-abonne',
  templateUrl: './abonne.component.html',
  styleUrls: ['./abonne.component.css'],
})
export class AbonneComponent implements OnInit {
  currentsearch = '';
  allAbonnes = [];
  userLogedIn: any = { role: 'USER' };
  searchUser = null;
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
        this.userLogedIn.role !== 'ADMIN' &&
        this.userLogedIn.role !== 'USER'
      ) {
        this.router.navigate(['/']);
      } else {
        this.abonneService.fetchAbonnes().subscribe((abonnes: any) => {
          this.allAbonnes = abonnes;
        });
      }
    });
  }
  deleteUser(id) {
    this.abonneService.deleteAbonne(id).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }

  addPres(id, ida) {
    this.abonneService.addPresence(id, ida).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
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
  change(data) {
    this.searchUser = data;
  }
  verfieDate(abonnement?: IAbonnement) {
    if (abonnement) {
      let abDate = new Date(abonnement.date);
      let nowdate = new Date();
      let endAbDate = abDate;
      if (abonnement.abType === 'SEANCE') {
        endAbDate.setDate(endAbDate.getDate() + 1);
      }
      if (abonnement.abType === '1 SEMAINE') {
        endAbDate.setDate(endAbDate.getDate() + 7);
      }
      if (abonnement.abType === '2 SEMAINE') {
        endAbDate.setDate(endAbDate.getDate() + 14);
      }
      if (abonnement.abType === '1 MOIS') {
        endAbDate.setMonth(endAbDate.getMonth() + 1);
      }
      if (abonnement.abType === '2 MOIS') {
        endAbDate.setMonth(endAbDate.getMonth() + 2);
      }
      if (abonnement.abType === '3 MOIS') {
        endAbDate.setMonth(endAbDate.getMonth() + 3);
      }
      if (abonnement.abType === '6 MOIS') {
        endAbDate.setMonth(endAbDate.getMonth() + 6);
      }
      if (abonnement.abType === 'AN') {
        endAbDate.setFullYear(endAbDate.getFullYear() + 1);
      }
      if (nowdate >= endAbDate) {
        return 'fini';
      } else if (nowdate < endAbDate) {
        if (nowdate >= new Date(endAbDate.valueOf() - 2 * 86400000)) {
          return 'dateProche';
        } else {
          return 'encours';
        }
      }
    }
  }
}
