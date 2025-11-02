import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FirebaseService } from '@/core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@/shared/pipes';
import { LanguageSwitcherComponent } from "@/shared/components/language-switcher/language-switcher.component";
import { User } from 'firebase/auth';

@Component({
    selector: 'layout',
    imports: [RouterOutlet, CommonModule, TranslatePipe, LanguageSwitcherComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit {

    title = 'iBozzi';
    sidebarCollapsed = false;
    mobileMenuOpen = false;
    user: User | null = null;

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);

    ngOnInit(): void {
        this.user = this.firebaseService.getCurrentUser();
    }

    toggleSidebar() {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    openMobileMenu() {
        this.sidebarCollapsed = false;
        this.mobileMenuOpen = true;
    }

    closeMobileMenu() {
        this.mobileMenuOpen = false;
    }

    async signOut() {
        await this.firebaseService.signOut();
        this.router.navigate(['/auth/login']);
    }
}
