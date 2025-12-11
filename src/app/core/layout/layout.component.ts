import { Component, Input, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FirebaseService } from '@/core/services/firebase.service';
import { MenuService } from '@/core/services/menu.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@/shared/pipes';
import { filter, Subject, takeUntil, Observable } from 'rxjs';
import { User } from '@/shared/types/user.type';
import { DemoService } from '../services';

@Component({
    selector: 'layout',
    imports: [RouterOutlet, CommonModule, TranslatePipe],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;
    sidebarCollapsed$: Observable<boolean> | undefined;
    mobileMenuOpen$: Observable<boolean> | undefined;
    user$!: Observable<User | null>;
    showArrow: boolean = false;

    @Input() showHeader = true;
    @Input() headerTitle: string | null = null;

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    private readonly menuService = inject(MenuService);
    private readonly demoService = inject(DemoService);
    private readonly destroy$ = new Subject<void>();

    ngOnInit(): void {
        this.sidebarCollapsed$ = this.menuService.sidebarCollapsed$;
        this.mobileMenuOpen$ = this.menuService.mobileMenuOpen$;
        this.user$ = this.firebaseService.user$;
        this.checkHeaderVisibility();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => this.checkHeaderVisibility());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    toggleSidebar() {
        this.menuService.toggleSidebar();
    }

    openMobileMenu() {
        this.menuService.openMobileMenu();
    }

    closeMobileMenu() {
        this.menuService.closeMobileMenu();
    }

    navTo(route: string) {
        this.router.navigate([route]);
        this.closeMobileMenu();
    }

    goBack() {
        window.history.back();
        this.closeMobileMenu();
    }

    async realodData() {
        this.isLoading = true;
        await this.demoService.realodData().subscribe({
            next: (res) => {
                this.isLoading = false;
                this.menuService.notifyDataReloaded();
            }
        });
    }

    private checkHeaderVisibility(): void {
        let route = this.router.routerState.root;

        while (route) {
            if (route.snapshot.data && Object.keys(route.snapshot.data).length) {
                const data = route.snapshot.data;
                if ('showHeader' in data) {
                    this.showHeader = data['showHeader'];
                }
                if ('headerTitle' in data) {
                    this.headerTitle = data['headerTitle'];
                }
                if ('showArrow' in data) {
                    this.showArrow = data['showArrow'];
                } else {
                    this.showArrow = false;
                }
            }
            route = route.firstChild as ActivatedRoute;
        }
    }
}
