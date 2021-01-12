import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar/navbar.component';
import { HomeComponent } from './home/home/home.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbonneService } from './service/abonne.service';
import { CaisseService } from './service/caisse.service';
import { EmployeeService } from './service/employee.service';
import { UserService } from './service/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login/login.component';
import { CreateUserComponent } from './user/createUser/create-user/create-user.component';
import { UpdateUserComponent } from './user/updateUser/update-user/update-user.component';
import { UserComponent } from './user/user/user.component';
import { SearchPipe } from './search.pipe';
import { AbonneComponent } from './abonne/abonne/abonne.component';
import { UpdateabonneComponent } from './abonne/updateabonne/updateabonne.component';
import { CaisseComponent } from './caisse/caisse/caisse.component';
import { UpdatecaisseComponent } from './caisse/updatecaisse/updatecaisse.component';
import { EmployeeComponent } from './employee/employee/employee.component';
import { EmployeeupdateComponent } from './employee/employeeupdate/employeeupdate.component';
import { AbonnecreateComponent } from './abonne/abonnecreate/abonnecreate.component';
import { EmployeecreateComponent } from './employee/employeecreate/employeecreate.component';
import { AbonnedetailComponent } from './abonne/abonnedetail/abonnedetail.component';
import { AddabonnementComponent } from './abonne/addabonnement/addabonnement.component';
import { EmployeedetailComponent } from './employee/employeedetail/employeedetail.component';
import { AbonnementPipe } from './abonnement.pipe';
import { PresenceComponent } from './presence/presence.component';
import { StatPipe } from './stat.pipe';
import { BuvetteService } from './service/buvette.service';
import { CourbeComponent } from './courbe/courbe.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    CreateUserComponent,
    UpdateUserComponent,
    UserComponent,
    SearchPipe,
    StatPipe,
    AbonnementPipe,
    AbonneComponent,
    UpdateabonneComponent,
    CaisseComponent,
    UpdatecaisseComponent,
    EmployeeComponent,
    EmployeeupdateComponent,
    AbonnecreateComponent,
    EmployeecreateComponent,
    AbonnedetailComponent,
    AddabonnementComponent,
    EmployeedetailComponent,
    PresenceComponent,
    CourbeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    HttpClient,
    AbonneService,
    CaisseService,
    BuvetteService,
    EmployeeService,
    UserService,
    FormControl,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
