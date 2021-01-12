import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  userLoguedIn;
  createLogForm = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    role: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data: any) => {
      this.userLoguedIn = data;
      if (data.role !== 'SUPERADMIN' && data.role !== 'ADMIN') {
        this.router.navigate(['/']);
      }
    });
  }

  save() {
    this.userService
      .addUser(this.createLogForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("L'utilisateur a été ajouté avec succès");
          this.router.navigate(['/user']);
        }
      });
  }
}
