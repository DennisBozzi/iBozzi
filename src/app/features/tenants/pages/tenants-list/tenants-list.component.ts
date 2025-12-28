import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from "../../../../shared/pipes/t.pipe";
import { TenantService, ToastService } from '@/core/services';
import { finalize } from 'rxjs';
import { PagedResult, TenantResponse } from '@/shared/interfaces';
import { FormsModule } from '@angular/forms';
import { PhonePipe } from "../../../../shared/pipes/phone.pipe";

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe, FormsModule, PhonePipe],
  templateUrl: './tenants-list.component.html'
})

export class TenantsListComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly tenService = inject(TenantService);
  private readonly toastService = inject(ToastService);

  page: number = 1;
  pageSize: number = 12;
  nameCpf: string = '';
  active: boolean = false;

  isLoading: boolean = true;
  tenants!: PagedResult<TenantResponse>;

  ngOnInit(): void {
    this.searchTenants();
  }

  searchTenants() {
    this.isLoading = true;
    this.tenService.getTenants(this.page, this.pageSize, this.nameCpf, this.active)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res) => {
          this.tenants = res;
        },
        error: (err) => {
          this.toastService.error(err.message);
        }
      })
  }

  navTo(route: string) {
    this.router.navigate([route]);
  }

  goToPage(pageNumber: number) {
    this.page = pageNumber;
    this.searchTenants();
  }

  get pageNumbers(): number[] {
    if (!this.tenants) return [];

    const totalPages = this.tenants.totalPages;
    const currentPage = this.tenants.currentPage;
    const pages: number[] = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
