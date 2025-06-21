import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="text-white text-center text-2xl mt-32">
      Logging in...
    </div>
    <div *ngIf="!loading" class="text-white text-center text-2xl mt-32">
      Redirecting...
    </div>
  `
})
export class CallbackComponent implements OnInit {
  loading = true;

  constructor(private auth: AuthService) {
    console.log('CallbackComponent initialized');
  }

  ngOnInit(): void {
    console.log('Starting auth state check');
    this.auth.checkAuthState()
      .then(() => {
        console.log('Auth state check completed');
        this.loading = false;
      })
      .catch(err => {
        console.error('Auth state check failed:', err);
        this.loading = false;
      });
  }
}
