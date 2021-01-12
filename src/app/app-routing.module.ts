import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbonneComponent } from './abonne/abonne/abonne.component';
import { AbonnecreateComponent } from './abonne/abonnecreate/abonnecreate.component';
import { AbonnedetailComponent } from './abonne/abonnedetail/abonnedetail.component';
import { AddabonnementComponent } from './abonne/addabonnement/addabonnement.component';
import { UpdateabonneComponent } from './abonne/updateabonne/updateabonne.component';
import { CaisseComponent } from './caisse/caisse/caisse.component';
import { UpdatecaisseComponent } from './caisse/updatecaisse/updatecaisse.component';
import { CourbeComponent } from './courbe/courbe.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeecreateComponent } from './employee/employeecreate/employeecreate.component';
import { EmployeedetailComponent } from './employee/employeedetail/employeedetail.component';
import { EmployeeupdateComponent } from './employee/employeeupdate/employeeupdate.component';

import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './login/login/login.component';
import { PresenceComponent } from './presence/presence.component';
import { CreateUserComponent } from './user/createUser/create-user/create-user.component';
import { UpdateUserComponent } from './user/updateUser/update-user/update-user.component';
import { UserComponent } from './user/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'updateuser/:id', component: UpdateUserComponent },
  { path: 'createuser', component: CreateUserComponent },
  { path: 'abonne', component: AbonneComponent },
  { path: 'abonnedetail/:id', component: AbonnedetailComponent },
  { path: 'abonnecreate', component: AbonnecreateComponent },
  { path: 'abonneupdate/:id', component: UpdateabonneComponent },
  { path: 'addabonnement/:id', component: AddabonnementComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employeedetail/:id', component: EmployeedetailComponent },
  { path: 'employeeupdate/:id', component: EmployeeupdateComponent },
  { path: 'employeecreate', component: EmployeecreateComponent },
  { path: 'caisse', component: CaisseComponent },
  { path: 'abonnementcaisse', component: UpdatecaisseComponent },
  { path: 'presence', component: PresenceComponent },
  { path: 'courbe', component: CourbeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
