import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Landing page component - Application entry point
 * 
 * @remarks
 * Features:
 * - Initial authentication state check
 * - GitHub login functionality
 * - Error handling for failed auth attempts
 * - Responsive welcome screen
 * 
 * @note Uses AuthService for authentication flow
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  /** Error message from failed authentication */
  errorMessage: string | null = null;

  /**
   * @param auth - AuthService for authentication
   * @param router - Angular router for navigation
   */
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    try {
      const navigation = this.router.getCurrentNavigation();
      this.errorMessage = navigation?.extras?.state?.['error'] || null;
    } catch (e) {
      this.errorMessage = null;
    }
  }

  /**
   * Initialize component and check auth state
   */
  ngOnInit(): void {
    this.auth.checkAuthState();
  }

  /**
   * Initiate GitHub authentication flow
   */
  login() {
    this.auth.login();
  }
}
