import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

/**
 * Authentication service handling Auth0 integration
 * 
 * @remarks
 * This service manages:
 * - User authentication via Auth0
 * - GitHub OAuth flow
 * - User state management
 * - Protected route access
 * 
 * @note Uses Auth0 SPA SDK for frontend authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client: Auth0Client | null = null;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private isBrowser: boolean;

  /**
   * @param platformId - Used for server-side rendering compatibility
   * @param router - Angular router for navigation
   */
  constructor(@Inject(PLATFORM_ID) platformId: Object , private router: Router) {
    
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initAuth0();
    }
  }

  private async initAuth0() {
    if (!this.isBrowser) return;
    console.log('Initializing Auth0 client');

    try {
      // Dynamically import Auth0 client to avoid SSR issues
      const { createAuth0Client } = await import('@auth0/auth0-spa-js');
      
      this.auth0Client = await createAuth0Client({
        domain: environment.auth0.domain,
        clientId: environment.auth0.clientId,
        authorizationParams: {
          redirect_uri: environment.auth0.callbackUrl,
          connection: 'github'
        },
        cacheLocation: 'localstorage',
        useRefreshTokens: true
      });
      console.log('Auth0 client initialized');

      // Check auth state
      const isAuthenticated = await this.auth0Client.isAuthenticated();
      console.log('Initial auth state:', isAuthenticated);
      
      if (isAuthenticated) {
        const user = await this.auth0Client.getUser();
        console.log('Initial user:', user);
        this.userSubject.next(user || null);
      }
    } catch (err) {
      console.error('Auth0 initialization failed:', err);
      this.userSubject.next(null);
    }
  }

 private handleRedirectCallback = async () => {
  if (!this.isBrowser) return;
  console.log('Starting handleRedirectCallback');
  
  try {
    console.log('Processing Auth0 redirect callback');
    const result = await this.auth0Client?.handleRedirectCallback();
    console.log('Auth0 callback result:', result);

    console.log('Getting user from Auth0');
    const user = await this.auth0Client?.getUser();
    console.log('Authenticated user:', user);
    this.userSubject.next(user);

    const returnTo = result?.appState?.returnTo || '/home';
    console.log('Attempting navigation to:', returnTo);
    
    const routeExists = this.router.config.some(route => route.path === returnTo.replace(/^\//, ''));
    if (routeExists) {
      console.log('Navigating to:', returnTo);
      await this.router.navigate([returnTo]);
      console.log('Navigation completed');
    } else {
      console.log('Route not found, navigating to home');
      await this.router.navigate(['/home']);
    }
  } catch (err) {
    console.error('Error in handleRedirectCallback:', err);
    console.log('Navigating to home due to error');
    await this.router.navigate(['/']);
  }
};


  async login(targetRoute?: string) {
    if (!this.isBrowser) return;
    try {
      await this.auth0Client?.loginWithRedirect({
        authorizationParams: {
          redirect_uri: environment.auth0.callbackUrl,
          connection: 'github',
          appState: { returnTo: targetRoute || '/' }
        }
      });
    } catch (err) {
      console.error('GitHub login failed:', err);
      this.router.navigate(['/'], {
        state: { error: 'GitHub authentication failed. Please try again.' }
      });
    }
  }

  async logout() {
    if (!this.isBrowser) return;
    this.userSubject.next(null);
    await this.auth0Client?.logout({
      logoutParams: {
      returnTo: environment.auth0.logoutRedirectUrl
      }
    });
  }

  async checkAuthState(): Promise<void> {
    if (!this.isBrowser) return;
    
    // Ensure client is ready
    if (!this.auth0Client) {
      console.log('Initializing Auth0 client');
      await this.initAuth0();
    }

    try {
      console.log('Checking auth state');
      const isAuthenticated = await this.auth0Client?.isAuthenticated();
      console.log('Auth state:', isAuthenticated);
      
      if (isAuthenticated) {
        const user = await this.auth0Client?.getUser();
        console.log('Authenticated user:', user);
        this.userSubject.next(user);
      } else if (window.location.search.includes('code=')) {
        console.log('Handling redirect callback');
        await this.handleRedirectCallback();
      }
    } catch (err) {
      console.error('Error checking auth state:', err);
      throw err;
    }
  }

  async getUser(): Promise<any> {
    if (!this.isBrowser) return null;
    return new Promise((resolve) => {
      const subscription = this.user$.subscribe(user => {
        resolve(user);
        subscription.unsubscribe();
      });
    });
  }
}
