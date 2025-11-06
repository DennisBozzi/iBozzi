import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeService } from './core/services/theme.service';
import { FirebaseService } from './core/services/firebase.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly themeService = inject(ThemeService);
  private readonly firebaseService = inject(FirebaseService);

  async ngOnInit(): Promise<void> {
    // Registrar ThemeService no FirebaseService para carregamento automático no login
    this.firebaseService.setThemeService(this.themeService);
    await this.themeService.loadAndApplyTheme();
  }
}
