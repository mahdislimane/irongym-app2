import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbonneService } from 'src/app/service/abonne.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-updateabonne',
  templateUrl: './updateabonne.component.html',
  styleUrls: ['./updateabonne.component.css'],
})
export class UpdateabonneComponent implements OnInit {
  createForm = this.fb.group({
    id: [],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    phoneNumber: [null, Validators.required],
  });
  userLogedIn: any = { role: 'USER' };
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private abonneService: AbonneService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data: any) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN'
      ) {
        this.router.navigate(['/']);
      }
    });
    this.abonneService
      .getAbonne(this.route.snapshot.params['id'])
      .subscribe((data: any) => {
        this.updateForm(data);
      });
  }

  updateForm(abonne) {
    this.createForm.patchValue({
      id: abonne.id,
      firstName: abonne.firstName,
      lastName: abonne.lastName,
      phoneNumber: abonne.phoneNumber,
      email: abonne.email,
    });
  }

  save() {
    this.abonneService
      .editAbonne(this.createForm.value.id, this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("L'abonné a été modifié avec succès");
          this.router.navigate(['/abonne']);
        }
      });
  }
}
