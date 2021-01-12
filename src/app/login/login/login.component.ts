import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    login: [null, [Validators.required]],
    password: [null, [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('x-auth-token')) {
      this.userService.getUserLogedIn().subscribe((data: any) => {
        if (
          data.role === 'SUPERADMIN' ||
          data.role === 'ADMIN' ||
          data.role === 'USER'
        ) {
          this.router.navigate(['/']);
        } else {
          localStorage.removeItem('x-auth-token');
          localStorage.removeItem('state');
        }
      });
    }
  }

  login() {
    this.userService.loginUser(this.loginForm.value).subscribe((data: any) => {
      if (data.msg) {
        alert(data.msg);
      } else {
        localStorage.setItem('x-auth-token', data);
        location.reload();
      }
    });
  }
}
