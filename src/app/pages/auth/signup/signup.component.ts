import { FirebaseService } from '@/services/firebase.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  email!: string;
  password!: string;
  isLoading: boolean = false;
  isImageLoading: boolean = true;

  private readonly firebaseService = inject(FirebaseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  async signUp() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signUpWithEmail(this.email, this.password,);

    this.isLoading = false
    if (error) {
      //TODO: Implementar tratamento de erro
    } else {
      //TODO: Implementar mensagem de sucesso de cadastro
      this.router.navigate(['/login']);
    }
  }

  async signInWithGoogle() {
    if (this.isLoading) return

    this.isLoading = true;
    const { error } = await this.firebaseService.signInWithGoogle();
    this.isLoading = false;

    if (error) {
      //TODO: Implementar tratamento de erro
    } else {
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
      //TODO: Implementar tratamento de erro
    } else {
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
    this.router.navigate(['/login']);
  }

  onImageLoaded() {
    this.isImageLoading = false;
  }
}