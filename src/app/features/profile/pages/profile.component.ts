import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseService, ToastService } from '@/core/services';
import { Router } from '@angular/router';
import { LanguageSwitcherComponent } from "@/shared/components/language-switcher/language-switcher.component";
import { ThemeSwitcherComponent } from "@/shared/components/theme-switcher/theme-switcher.component";
import { TranslatePipe } from "../../../shared/pipes/t.pipe";
import { MenuToggleButtonComponent } from "@/shared/components/menu-toggle-button/menu-toggle-button.component";
import { MenuService } from '@/core/services/menu.service';
import { GlobalMessages } from '@/shared/i18n/global-messages';
import { User } from '@/shared/types/user.type';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule, LanguageSwitcherComponent, ThemeSwitcherComponent, TranslatePipe, MenuToggleButtonComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    private readonly toastService = inject(ToastService);
    readonly menuService = inject(MenuService);

    user$!: Observable<User | null>;
    isEditingName = false;
    editingNameValue = '';
    private currentUser: User | null = null;
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.user$ = this.firebaseService.user$;
        this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        await this.firebaseService.uploadProfilePhoto(file);
    }

    startEditingName() {
        this.editingNameValue = this.currentUser?.displayName || '';
        this.isEditingName = true;
    }

    async saveName() {
        if (!this.editingNameValue.trim()) {
            this.cancelEditName();
            return;
        }

        await this.firebaseService.updateProfile(this.editingNameValue);
        this.cancelEditName();
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
        return this.currentUser?.providerData
            .some((provider: any) => provider.providerId === 'google.com') ?? false;
    }

    async connectGoogle() {
        const { error } = await this.firebaseService.linkGoogleAccount();

        if (error)
            this.toastService.error(GlobalMessages.t('toasts.linkedError'));
        else
            this.toastService.success(GlobalMessages.t('toasts.linkedGoogle'));

    }

    // GitHub
    linkedGithub(): boolean {
        return this.currentUser?.providerData
            .some((provider: any) => provider.providerId === 'github.com') ?? false;
    }

    async connectGithub() {
        const { error } = await this.firebaseService.linkGithubAccount();

        if (error)
            this.toastService.error(GlobalMessages.t('toasts.linkedError'));
        else
            this.toastService.success(GlobalMessages.t('toasts.linkedGithub'));

    }
}
