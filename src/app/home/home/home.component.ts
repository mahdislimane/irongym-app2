import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAbonnement } from 'src/app/model/abonnement.model';
import { AbonneService } from 'src/app/service/abonne.service';
import { BuvetteService } from 'src/app/service/buvette.service';
import { CaisseService } from 'src/app/service/caisse.service';
import { EmployeeService } from 'src/app/service/employee.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  currentsearch = '';
  allEmployees = [];
  allAbonnes = [];
  changeForm = '';
  depChangeForm = '';
  payToAdd = 0;
  theDescription = '';
  allIncomes = [];
  allOutcomes = [];
  nowYear = new Date().getFullYear();
  nowMonth = new Date().getMonth() + 1;
  nowDay = new Date().getDate();
  userLogedIn: any = { role: 'USER' };
  produit = 'eau';
  prix = 1;
  card = '';
  allBuvette = [];
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private caisseService: CaisseService,
    private buvetteService: BuvetteService,
    private abonneService: AbonneService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUserLogedIn().subscribe((data) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN' &&
        this.userLogedIn.role !== 'USER'
      ) {
        location.reload();
      } else {
        this.employeeService.getEmployees().subscribe((employees: any) => {
          this.allEmployees = employees;
        });
        this.caisseService.getIncome().subscribe((income: any) => {
          this.allIncomes = income;
        });
        this.caisseService.getOutcome().subscribe((outcome: any) => {
          this.allOutcomes = outcome;
        });
        this.abonneService.fetchAbonnes().subscribe((abonnes: any) => {
          this.allAbonnes = abonnes;
        });
        this.buvetteService.getBuvette().subscribe((Buvettes: any) => {
          this.allBuvette = Buvettes;
        });
        if (localStorage.getItem('state') !== 'connected') {
          alert('Bienvenue ' + this.userLogedIn.firstName);
          localStorage.setItem('state', 'connected');
        }
      }
    });
  }
  change(id) {
    this.changeForm = id;
  }

  addBuvette() {
    let newBuvette = {
      comment: this.produit,
      price: this.prix,
    };
    this.buvetteService.addBuvette(newBuvette).subscribe((data: any) => {
      if (data.msg !== 'OK') {
        alert(data.msg);
      } else {
        location.reload();
      }
    });
  }

  delBuv(buvette) {
    this.buvetteService.deleteBuvette(buvette.id).subscribe((data: any) => {
      if (data.msg !== 'OK') {
        alert(data.msg);
      } else {
        alert('Produit supprimé');
        location.reload();
      }
    });
  }

  deleteBuvette(buvette) {
    this.buvetteService.deleteBuvette(buvette.id).subscribe((data: any) => {
      if (data.msg !== 'OK') {
        alert(data.msg);
      } else {
        this.addIncome(buvette);
      }
    });
  }

  addIncome(data) {
    let abDate = new Date();
    let newIncome = {
      date: new Date(),
      year: abDate.getFullYear(),
      month: abDate.getMonth() + 1,
      day: abDate.getDate(),
      amount: data.price,
      abonneName:
        data.comment +
        ' le ' +
        new Intl.DateTimeFormat('fr').format(new Date(data.date)),
    };
    console.log(newIncome);
    this.caisseService.addIncome(newIncome).subscribe((data1: any) => {
      if (data1.msg !== 'OK') {
        alert(data1.msg);
      } else {
        alert('Montant ajouté à la caisse');
        location.reload();
      }
    });
  }

  changedepChangeForm(data) {
    this.depChangeForm = data;
  }

  addAvance(emp) {
    let nowDate = new Date();
    let newAvance = {
      date: nowDate,
      year: nowDate.getFullYear(),
      month: nowDate.getMonth() + 1,
      amount: this.payToAdd,
    };

    let salaryID = emp.salarys[emp.salarys.length - 1].id;
    this.employeeService
      .addAvance(emp.id, newAvance, salaryID)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("l'avance a été ajoutée");
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
          this.caisseService.addOutcome(newOutcome).subscribe((data1: any) => {
            if (data1.msg !== 'OK') {
              alert(data1.msg);
            } else {
              alert('le payement a été enregistré');
              location.reload();
            }
          });
        }
      });
    this.change('');
  }

  addDepense() {
    if (this.payToAdd !== 0) {
      let nowDate = new Date();
      let newOutcome = {
        date: nowDate,
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        day: nowDate.getDate(),
        amount: this.payToAdd,
        description: this.theDescription,
        employee: this.userLogedIn.firstName + ' ' + this.userLogedIn.lastName,
      };
      this.caisseService.addOutcome(newOutcome).subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert('la dépense a été enregistré');
        }
        this.changedepChangeForm('');
        location.reload();
      });
    }
  }

  addEntExt(id) {
    let ids;
    this.allEmployees.map((el) => {
      if (el.id == id) {
        el.salarys.map((ele) => {
          if (
            ele.year == new Date().getFullYear() &&
            ele.month == new Date().getMonth() + 1
          ) {
            ids = ele.id;
          }
        });
      }
    });
    this.employeeService.addEnterExit(id, ids).subscribe((respon: any) => {
      if (!respon.msg) {
        console.log(respon);
      } else {
        alert(respon.msg);
        location.reload();
      }
    });
  }

  calcul(data: any) {
    let val = 0;
    data.map((el) => (val += el.amount));
    return val;
  }

  abLength(data) {
    let arr = [];
    arr = data;
    return arr.length - 1;
  }

  addPres(id, ida) {
    this.abonneService.addPresence(id, ida).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
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
