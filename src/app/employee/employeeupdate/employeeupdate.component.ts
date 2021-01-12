import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/service/employee.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-employeeupdate',
  templateUrl: './employeeupdate.component.html',
  styleUrls: ['./employeeupdate.component.css'],
})
export class EmployeeupdateComponent implements OnInit {
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
    endDate: [null],
  });
  job;
  userLogedIn: any = { role: 'USER' };
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
        this.userLogedIn.role !== 'ADMIN'
      ) {
        this.router.navigate(['/']);
      }
    });
    this.employeeService
      .getSelectedEmployee(this.route.snapshot.params['id'])
      .subscribe((data: any) => {
        this.updateForm(data);
      });
  }

  updateForm(employee) {
    this.createForm.patchValue({
      id: employee.id,
      fullName: employee.fullName,
      jobTitle: employee.jobTitle,
      phoneNumber: employee.phoneNumber,
      cardNumber: employee.cardNumber1,
      cardNumber2: employee.cardNumber2,
      cin: employee.cin,
      part: employee.part,
      startDate: employee.startDate,
      endDate: employee.endDate,
    });
    this.job = employee.jobTitle;
  }

  save() {
    this.employeeService
      .editEmployee(this.createForm.value.id, this.createForm.value)
      .subscribe((data: any) => {
        if (data.msg !== 'employee updated') {
          alert(data.msg);
        } else {
          alert("L'employée a été modifié avec succès");
          this.router.navigate(['/employee']);
        }
      });
  }
}
