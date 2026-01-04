import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TenantResponse } from '@/shared/interfaces';
import { CpfPipe, TranslatePipe } from '@/shared/pipes';

@Component({
    selector: 'app-tenant-autocomplete',
    standalone: true,
    imports: [CommonModule, FormsModule, CpfPipe, TranslatePipe],
    templateUrl: './tenant-autocomplete.component.html',
    styleUrl: './tenant-autocomplete.component.scss'
})
export class TenantAutocompleteComponent implements OnInit, OnDestroy {
    @Input() placeholder = 'layout.autoPlaceholderTenant';
    @Input() set tenants(value: TenantResponse[]) {
        this.filteredTenants = value;
    }
    @Input() isLoading = false;

    @Output() search = new EventEmitter<string>();
    @Output() selected = new EventEmitter<TenantResponse>();

    searchTerm = '';
    filteredTenants: TenantResponse[] = [];
    isOpen = false;
    selectedIndex = -1;

    private searchSubject = new Subject<string>();
    private destroy$ = new Subject<void>();

    ngOnInit() {
        this.searchSubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(term => {
                this.search.emit(term);
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchTerm = value;
        this.selectedIndex = -1;

        if (value.length > 0)
            this.isOpen = true;

        this.searchSubject.next(value);
    }

    onKeyDown(event: KeyboardEvent) {
        if (!this.isOpen || this.filteredTenants.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredTenants.length - 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                break;
            case 'Enter':
                event.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectTenant(this.filteredTenants[this.selectedIndex]);
                }
                break;
            case 'Escape':
                event.preventDefault();
                this.isOpen = false;
                break;
        }
    }

    selectTenant(tenant: TenantResponse) {
        this.searchTerm = `${tenant.firstName} ${tenant.lastName}`;
        this.selected.emit(tenant);
        this.isOpen = false;
        this.selectedIndex = -1;
    }

    onBlur() {
        setTimeout(() => {
            this.isOpen = false;
        }, 200);
    }
}

