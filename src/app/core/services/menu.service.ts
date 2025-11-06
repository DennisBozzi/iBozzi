import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
    private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);

    sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();
    mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

    toggleSidebar() {
        const current = this.sidebarCollapsedSubject.value;
        this.sidebarCollapsedSubject.next(!current);
    }

    openMobileMenu() {
        this.sidebarCollapsedSubject.next(false);
        this.mobileMenuOpenSubject.next(true);
    }

    closeMobileMenu() {
        this.mobileMenuOpenSubject.next(false);
    }

    getSidebarCollapsed(): boolean {
        return this.sidebarCollapsedSubject.value;
    }

    getMobileMenuOpen(): boolean {
        return this.mobileMenuOpenSubject.value;
    }
}
