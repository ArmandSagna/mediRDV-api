import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { BookingComponent } from './booking.component';
import { DoctorsComponent } from './doctors.component';
import { DoctorDetailComponent } from './doctor-detail.component';
import { DashboardComponent } from './dashboard.component';
import { PatientsComponent } from './patients.component';
import { PatientDetailComponent } from './patient-detail.component';
import { AppointmentsComponent } from './appointments.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'appointments', component: AppointmentsComponent, canActivate: [AuthGuard] },
  { path: 'patients/:id', component: PatientDetailComponent, canActivate: [AuthGuard] },
  { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
  { path: 'doctors/:id', component: DoctorDetailComponent, canActivate: [AuthGuard] },
  { path: 'doctors', component: DoctorsComponent, canActivate: [AuthGuard] },
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'dashboard' }
];
