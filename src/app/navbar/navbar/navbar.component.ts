import { HttpHandler } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userLogedIn: any = { role: '' };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('x-auth-token')) {
      this.router.navigate(['/login']);
    } else {
      this.userService.getUserLogedIn().subscribe((data: any) => {
        if (!data) {
          this.router.navigate(['/login']);
        } else if (data.msg == 'disconnected') {
          this.userLogedIn = data;
          this.deconnexion();
        } else {
          this.userLogedIn = data;
        }
      });
    }
  }
  deconnexion() {
    this.userService
      .logoutUser(this.userLogedIn.login)
      .subscribe((data: any) => {
        if (data.msg) {
          alert(data.msg);
        }
      });
    localStorage.removeItem('x-auth-token');
    localStorage.removeItem('state');
    location.reload();
  }
}
