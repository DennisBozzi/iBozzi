import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, ToastService } from '@/core/services';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from "@/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "@/shared/components/theme-switcher/theme-switcher.component";
import { User } from 'firebase/auth';
import { TranslatePipe } from "../../../shared/pipes/t.pipe";
import { MenuToggleButtonComponent } from "@/shared/components/menu-toggle-button/menu-toggle-button.component";
import { MenuService } from '@/core/services/menu.service';
import { GlobalMessages } from '@/shared/i18n/global-messages';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, LanguageSwitcherComponent, ThemeSwitcherComponent, TranslatePipe, MenuToggleButtonComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    private readonly toastService = inject(ToastService);
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

    // Google
    linkedGoogle(): boolean {
        return this.user?.providerData
            .some(provider => provider.providerId === 'google.com') ?? false;
    }

    async connectGoogle() {
        const { error } = await this.firebaseService.linkGoogleAccount();

        if (error) {
            this.toastService.error(GlobalMessages.t('toasts.linkedError'));
        } else {
            this.toastService.success(GlobalMessages.t('toasts.linkedGoogle'));
            this.user = this.firebaseService.getCurrentUser();
        }
    }

    // GitHub
    linkedGithub(): boolean {
        return this.user?.providerData
            .some(provider => provider.providerId === 'github.com') ?? false;
    }

    async connectGithub() {
        const { error } = await this.firebaseService.linkGithubAccount();

        if (error) {
            this.toastService.error(GlobalMessages.t('toasts.linkedError'));
        } else {
            this.toastService.success(GlobalMessages.t('toasts.linkedGithub'));
            this.user = this.firebaseService.getCurrentUser();
        }
    }

}
