import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAbonne } from 'src/app/model/abonne.model';
import { AbonneService } from 'src/app/service/abonne.service';
import { CaisseService } from 'src/app/service/caisse.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-abonnedetail',
  templateUrl: './abonnedetail.component.html',
  styleUrls: ['./abonnedetail.component.css'],
})
export class AbonnedetailComponent implements OnInit {
  currentAbonne;
  changeForm = '';
  payToAdd = 0;
  allAbonnements = [];
  userLogedIn: any = { role: 'USER' };
  constructor(
    private userService: UserService,
    private abonneService: AbonneService,
    private caisseService: CaisseService,
    private router: Router,
    private route: ActivatedRoute
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
        this.abonneService
          .getAbonne(this.route.snapshot.params['id'])
          .subscribe((abonne: IAbonne) => {
            this.currentAbonne = abonne;
            this.allAbonnements = this.currentAbonne.abonnements;
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
  deletePresence(id, ida, idp) {
    this.abonneService.deletePresence(id, ida, idp).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }
  addPay(id, ida) {
    this.abonneService
      .addPay(id, ida, { pay: this.payToAdd })
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert('Le payment a été enregistrer');
          this.change('');
          let abDate = new Date();
          let newIncome = {
            date: abDate,
            year: abDate.getFullYear(),
            month: abDate.getMonth() + 1,
            day: abDate.getDate(),
            amount: this.payToAdd,
            abonneName: data.abName,
            abonnementId: data.incomeID,
          };
          this.caisseService.addIncome(newIncome).subscribe((data: any) => {
            if (data.msg !== 'OK') {
              alert(data.msg);
            } else {
              alert('Montant ajouté à la caisse');
            }
          });
          location.reload();
        }
      });
  }
  change(id) {
    this.changeForm = id;
  }
}
