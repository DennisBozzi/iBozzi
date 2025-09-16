import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '@/services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {


  pessoa = {
    nome: '',
    email: '',
    password: ''
  }





  email!: string;
  password!: string;
  isLoading: boolean = false;
  isImageLoading: boolean = true;

  private readonly firebaseService = inject(FirebaseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  async signInWithEmail() {
    if (this.isLoading) return

    this.isLoading = true;

    const { error } = await this.firebaseService.signInWithEmail({
      email: this.email,
      password: this.password,
    });

    this.isLoading = false
    if (error) {
      //TODO: Implementar erro de requisição
    } else {
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
      //TODO: Implementar erro de requisição
    } else {
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
      //TODO: Implementar erro de requisição
    } else {
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
    this.router.navigate(['/signup']);
  }

  onImageLoaded() {
    this.isImageLoading = false;
  }
}
