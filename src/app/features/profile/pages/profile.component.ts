import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '@/core/services';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from "@/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "@/shared/components/theme-switcher/theme-switcher.component";
import { User } from 'firebase/auth';
import { TranslatePipe } from "../../../shared/pipes/t.pipe";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, LanguageSwitcherComponent, ThemeSwitcherComponent, TranslatePipe],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    user: User | null = null;

    ngOnInit(): void {
        this.user = this.firebaseService.getCurrentUser();
    }

    async signOut() {
        await this.firebaseService.signOut();
        this.router.navigate(['/auth/login']);
    }

}
