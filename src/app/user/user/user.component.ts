import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  currentsearchMonth = new Date().getMonth() + 1;
  currentsearchYear = new Date().getFullYear();
  currentsearch = '';
  allUser = [];
  userLogedIn: any = { role: 'USER' };
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUserLogedIn().subscribe((data) => {
      this.userLogedIn = data;
      if (
        this.userLogedIn.role !== 'SUPERADMIN' &&
        this.userLogedIn.role !== 'ADMIN'
      ) {
        this.router.navigate(['/']);
      } else {
        this.userService.getAllUsers().subscribe((users) => {
          this.allUser = users;
          console.log(users);
        });
      }
    });
  }
  deleteUser(id) {
    this.userService.deleteUser(id).subscribe((data: any) => {
      alert(data.msg);
      location.reload();
    });
  }
  checkDate(data) {
    if (
      new Date(data).getMonth() + 1 == this.currentsearchMonth &&
      new Date(data).getFullYear() == this.currentsearchYear
    ) {
      return true;
    } else {
      return false;
    }
  }
}
