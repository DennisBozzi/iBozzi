import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private readonly SIDEBAR_STORAGE_KEY = 'ibozzi_sidebar_collapsed';
    private sidebarCollapsedSubject = new BehaviorSubject<boolean>(this.loadSidebarState());
    private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
    private dataReloadedSubject = new Subject<void>();

    sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();
    mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();
    dataReloaded$ = this.dataReloadedSubject.asObservable();

    toggleSidebar() {
        const current = this.sidebarCollapsedSubject.value;
        this.sidebarCollapsedSubject.next(!current);
        this.saveSidebarState(!current);
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

    notifyDataReloaded(): void {
        this.dataReloadedSubject.next();
    }

    private loadSidebarState(): boolean {
        const stored = localStorage.getItem(this.SIDEBAR_STORAGE_KEY);
        return stored ? JSON.parse(stored) : false;
    }

    private saveSidebarState(isCollapsed: boolean): void {
        localStorage.setItem(this.SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
    }
}
