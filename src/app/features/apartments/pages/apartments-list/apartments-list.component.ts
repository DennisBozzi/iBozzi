import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, CurrencyFormatPipe, FloorNamePipe } from "../../../../shared/pipes";
import { ApartmentsService } from '@/core/services';
import { MenuService } from '@/core/services/menu.service';
import { ApartmentResponse, PagedResult, TenantResponse } from '@/shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-apartments-list',
  standalone: true,
  imports: [CommonModule, TranslatePipe, CurrencyFormatPipe, FloorNamePipe],
  templateUrl: './apartments-list.component.html'
})

export class ApartmentsListComponent implements OnInit, OnDestroy {

  private readonly apService = inject(ApartmentsService);
  private readonly menuService = inject(MenuService);

  isLoading: boolean = false;
  isLoadingTenants: boolean = false;

  apartments!: PagedResult<ApartmentResponse>;
  availableTenants: TenantResponse[] = [];

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadApartments();

    this.menuService.dataReloaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadApartments();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadApartments() {
    this.isLoading = true;

    this.apService.getApartments().subscribe({
      next: (res) => {
        this.apartments = res;
        this.isLoading = false;
      }
    })
  }
}
