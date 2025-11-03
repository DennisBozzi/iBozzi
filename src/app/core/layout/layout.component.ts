import { Component, Input, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FirebaseService } from '@/core/services/firebase.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@/shared/pipes';
import { User } from 'firebase/auth';
import { filter } from 'rxjs';

@Component({
    selector: 'layout',
    imports: [RouterOutlet, CommonModule, TranslatePipe],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit {

    sidebarCollapsed = false;
    mobileMenuOpen = false;
    user: User | null = null;

    @Input() showHeader = true;
    @Input() headerTitle: string | null = null;

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);
    private readonly activatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.user = this.firebaseService.getCurrentUser();
        this.checkHeaderVisibility();

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => this.checkHeaderVisibility());
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

    navTo(route: string) {
        this.router.navigate([route]);
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
            }
            route = route.firstChild as ActivatedRoute;
        }
    }
}
