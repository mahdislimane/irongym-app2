import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AbonneService } from 'src/app/service/abonne.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-abonnecreate',
  templateUrl: './abonnecreate.component.html',
  styleUrls: ['./abonnecreate.component.css'],
})
export class AbonnecreateComponent implements OnInit {
  createForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    phoneNumber: [null, Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private abonneService: AbonneService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data: any) => {
      if (
        data.role !== 'SUPERADMIN' &&
        data.role !== 'ADMIN' &&
        data.role !== 'USER'
      ) {
        this.router.navigate(['/']);
      }
    });
  }

  save() {
    this.abonneService
      .createAbonne(this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("L'abonné a été ajouté avec succès");
          this.router.navigate(['/abonne']);
        }
      });
  }
}
