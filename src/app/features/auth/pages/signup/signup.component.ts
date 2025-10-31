import { ToastService } from '@/core/services';
import { FirebaseService } from '@/core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule,],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {

  submitted: boolean = false;

  email!: string;
  password!: string;
  confirmPassword!: string;
  isLoading: boolean = false;

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
      this.toastService.error('Oops! Something wrong happened.');
    } else {
      this.toastService.success("Welcome! It's great to see you.");
      this.router.navigate(['/login']);
    }
  }

  async signInWithGoogle() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGoogle();
    this.isLoading = false;

    if (error) {
      this.toastService.error('Failed to connect with Google. Please try again.');
    } else {
      this.toastService.success("Welcome! It's great to see you.");
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
        this.toastService.error('You’ve already used this email with another login method. Please connect using that provider.', 6000);
      else
        this.toastService.error('Failed to connect with Github. Please try again.');
    } else {
      this.toastService.success("Welcome! It's great to see you.");
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