import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@/core/services';
import { Router } from '@angular/router';
import { TranslatePipe } from '@/shared/pipes';
import { LanguageSwitcherComponent } from '@/shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LanguageSwitcherComponent, TranslatePipe],
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  private readonly firebaseService = inject(FirebaseService);
  private readonly router = inject(Router);

  async signOut() {
    await this.firebaseService.signOut();
    this.router.navigate(['/auth/login']);
  }

  async link() {
    await this.firebaseService.linkGithubAccount();
  }
}
