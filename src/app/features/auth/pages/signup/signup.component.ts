import { ToastService } from '@/core/services';
import { FirebaseService } from '@/core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, SafeHtmlPipe } from '@/shared/pipes';
import { GlobalMessages } from '@/shared/i18n/global-messages';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, TranslatePipe, SafeHtmlPipe],
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  submitted: boolean = false;

  email!: string;
  password!: string;
  confirmPassword!: string;
  isLoading: boolean = false;
  readonly year: number = new Date().getFullYear();
  readonly copyrightParams = { year: this.year };

  private readonly firebaseService = inject(FirebaseService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  async signUp(emailCtrl: NgModel, passwordCtrl: NgModel, confirmPasswordCtrl: NgModel) {
    if (this.isLoading) return

    this.submitted = true;
    if (this.invalidInputs(emailCtrl, passwordCtrl, confirmPasswordCtrl)) return;

    this.isLoading = true;
    const { error } = await this.firebaseService.signUpWithEmail({
      email: this.email,
      password: this.password
    });

    this.isLoading = false

    if (error) {
      this.toastService.error(GlobalMessages.t('toasts.genericError'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcome'));
      this.router.navigate(['/login']);
    }
  }

  async signInWithGoogle() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGoogle();
    this.isLoading = false;

    if (error) {
      this.toastService.error(GlobalMessages.t('toasts.googleError'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcome'));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  async signInWithGithub() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGithub();
    this.isLoading = false;

    if (error) {
      if (error.code == 'auth/account-exists-with-different-credential')
        this.toastService.error(GlobalMessages.t('toasts.accountExistsDifferent'), 6000);
      else
        this.toastService.error(GlobalMessages.t('toasts.githubError'));
    } else {
      this.toastService.success(GlobalMessages.t('toasts.welcome'));
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        this.router.navigateByUrl(returnUrl);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  navigateToLogin() {
    if (this.isLoading) return
    this.router.navigate(['/auth/login']);
  }

  private invalidInputs(emailCtrl: NgModel, passwordCtrl: NgModel, confirmPasswordCtrl: NgModel): boolean {
    if (emailCtrl.invalid) return true;
    if (passwordCtrl.invalid) return true;
    if (confirmPasswordCtrl.invalid || (confirmPasswordCtrl.value != passwordCtrl.value)) return true;

    return false;
  }
}