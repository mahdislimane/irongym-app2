import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonneService } from 'src/app/service/abonne.service';
import { CaisseService } from 'src/app/service/caisse.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-addabonnement',
  templateUrl: './addabonnement.component.html',
  styleUrls: ['./addabonnement.component.css'],
})
export class AddabonnementComponent implements OnInit {
  userLogedIn: any = { role: 'USER' };
  createForm = this.fb.group({
    id: [],
    departement: [null, Validators.required],
    abType: [null, Validators.required],
    price: [null, Validators.required],
    pay: [null, Validators.required],
    date: [new Date(), Validators.required],
    presences: [[]],
  });
  currentAbonne;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private abonneService: AbonneService,
    private caisseService: CaisseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data: any) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN' &&
        this.userLogedIn.role !== 'USER'
      ) {
        this.router.navigate(['/']);
      }
    });
    this.abonneService
      .getAbonne(this.route.snapshot.params['id'])
      .subscribe((abonne: any) => {
        this.currentAbonne = abonne;
      });
  }

  save() {
    this.createForm.value.presences.push({
      userLogued: this.userLogedIn.firstName + ' ' + this.userLogedIn.lastName,
      date: new Date(),
    });
    this.abonneService
      .addAbonnement(this.route.snapshot.params['id'], this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("L'abonnement a été ajouté avec succès");
          let abDate = new Date(this.createForm.value.date);
          let newIncome = {
            date: new Date(),
            year: abDate.getFullYear(),
            month: abDate.getMonth() + 1,
            day: abDate.getDate(),
            amount: this.createForm.value.pay,
            abonnementId: data.incomeID,
            abonneName:
              this.currentAbonne.firstName + ' ' + this.currentAbonne.lastName,
          };
          this.caisseService.addIncome(newIncome).subscribe((data: any) => {
            if (data.msg !== 'OK') {
              alert(data.msg);
            } else {
              alert('Montant ajouté à la caisse');
            }
          });
          this.router.navigate([
            '/abonnedetail/' + this.route.snapshot.params['id'],
          ]);
        }
      });
  }
}
