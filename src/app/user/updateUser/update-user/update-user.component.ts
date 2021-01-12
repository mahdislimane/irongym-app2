import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  userLoguedIn;
  createLogForm = this.fb.group({
    id: [],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    role: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.minLength(8)]],
    oldPassword: [null, [Validators.required, Validators.minLength(8)]],
  });
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data: any) => {
      this.userLoguedIn = data;
      if (data.role !== 'SUPERADMIN' && data.role !== 'ADMIN') {
        this.router.navigate(['/']);
      }
    });
    this.userService
      .getUser(this.route.snapshot.params['id'])
      .subscribe((data: any) => {
        this.updateForm(data);
      });
  }

  updateForm(user) {
    this.createLogForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
    });
  }

  save() {
    this.userService
      .editUser(this.createLogForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'User updated') {
          alert(data.msg);
        } else {
          alert("L'utilisateur a été modifié avec succès");
          this.router.navigate(['/user']);
        }
      });
  }
}
