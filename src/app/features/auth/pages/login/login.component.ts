import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { FirebaseService } from '@/core/services/firebase.service';
import { ToastService } from '@/core/services/toast.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe, SafeHtmlPipe } from '@/shared/pipes';
import { GlobalMessages } from '@/shared/i18n/global-messages';
import { LanguageSwitcherComponent } from '@/shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, TranslatePipe, SafeHtmlPipe, LanguageSwitcherComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  submitted: boolean = false;

  email!: string;
  password!: string;
  isLoading: boolean = false;

  private readonly firebaseService = inject(FirebaseService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  async signInWithEmail(emailCtrl: NgModel, passwordCtrl: NgModel) {
    if (this.isLoading) return

    this.submitted = true;
    if (this.invalidInputs(emailCtrl, passwordCtrl)) return;

    this.isLoading = true;
    console.log(this.email, this.password)

    const { error } = await this.firebaseService.signInWithEmail({
      email: this.email,
      password: this.password,
    });

    this.isLoading = false
    if (error) {
      this.toastService.error(GlobalMessages.t('toasts.loginInvalid'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcomeBack'));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  async loginWithGoogle() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGoogle();
    this.isLoading = false;

    if (error) {
      this.toastService.error(GlobalMessages.t('toasts.googleError'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcomeBack'));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  async loginWithGithub() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGithub();
    this.isLoading = false;

    if (error) {
      this.toastService.error(GlobalMessages.t('toasts.githubError'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcomeBack'));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  navigateToSignup() {
    if (this.isLoading) return
    this.router.navigate(['auth/signup']);
  }

  private invalidInputs(emailCtrl: NgModel, passwordCtrl: NgModel): boolean {
    if (emailCtrl.invalid) return true;
    if (passwordCtrl.invalid) return true;

    return false;
  }
}
