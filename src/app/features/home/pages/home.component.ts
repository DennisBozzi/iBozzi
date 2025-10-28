import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  private readonly firebaseService = inject(FirebaseService);
  private readonly router = inject(Router);

  async signOut() {
    await this.firebaseService.signOut();
    this.router.navigate(['/auth/login']);
  }
}
