import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '@/core/services';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from "@/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "@/shared/components/theme-switcher/theme-switcher.component";
import { User } from 'firebase/auth';
import { TranslatePipe } from "../../../shared/pipes/t.pipe";
import { MenuToggleButtonComponent } from "@/shared/components/menu-toggle-button/menu-toggle-button.component";
import { MenuService } from '@/core/services/menu.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, LanguageSwitcherComponent, ThemeSwitcherComponent, TranslatePipe, MenuToggleButtonComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    readonly menuService = inject(MenuService);

    user: User | null = null;
    isEditingName = false;
    editingNameValue = '';

    ngOnInit(): void {
        this.user = this.firebaseService.getCurrentUser();
    }

    async onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        const result = await this.firebaseService.uploadProfilePhoto(file);
        if (!result.error) this.user = this.firebaseService.getCurrentUser();
    }

    startEditingName() {
        this.editingNameValue = this.user?.displayName || '';
        this.isEditingName = true;
    }

    async saveName() {
        if (!this.editingNameValue.trim()) {
            this.cancelEditName();
            return;
        }

        try {
            await this.firebaseService.updateProfile(this.editingNameValue);
            this.user = this.firebaseService.getCurrentUser();
            this.isEditingName = false;
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            this.cancelEditName();
        }
    }

    cancelEditName() {
        this.isEditingName = false;
        this.editingNameValue = '';
    }

    async signOut() {
        await this.firebaseService.signOut();
        this.router.navigate(['/auth/login']);
    }

}
