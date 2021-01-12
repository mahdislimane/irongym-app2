import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/service/employee.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-employeecreate',
  templateUrl: './employeecreate.component.html',
  styleUrls: ['./employeecreate.component.css'],
})
export class EmployeecreateComponent implements OnInit {
  job = 'RECEPTION';
  createForm = this.fb.group({
    id: [],
    fullName: [null, Validators.required],
    jobTitle: [null, Validators.required],
    phoneNumber: [null, Validators.required],
    cardNumber: [null],
    cardNumber2: [null],
    cin: [null, Validators.required],
    part: [0, Validators.required],
    startDate: [null, Validators.required],
  });
  userLogedIn: any = { role: 'USER' };
  currentAbonne;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private employeeService: EmployeeService,
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
  }

  save() {
    this.employeeService
      .addEmployee(this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'OK') {
          alert(data.msg);
        } else {
          alert("L'employée a été ajouté avec succès");
          this.router.navigate(['/employee']);
        }
      });
  }
}
