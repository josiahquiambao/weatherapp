import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { HomeComponent } from './components/home/home.component';
import { WeatherComponent } from './components/weather/weather.component';
import { AuthGuard } from './guards/auth.guard';

import { CallbackComponent } from './components/callback/callback.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'weather/:city',
    component: WeatherComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
