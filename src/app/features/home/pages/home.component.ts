import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@/core/services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'home.component.html',
})

export class HomeComponent {
  private readonly firebaseService = inject(FirebaseService);

  async link() {
    await this.firebaseService.linkGithubAccount();
  }
}
