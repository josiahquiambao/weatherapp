import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { configureFontAwesome } from './fontawesome.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  user: any = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private library: FaIconLibrary
  ) {
    configureFontAwesome(library);
    this.auth.user$.subscribe(user => this.user = user);
  }

  isLandingPage(): boolean {
    return this.router.url === '/';
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }
}
