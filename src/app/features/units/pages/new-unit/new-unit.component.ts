import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, CurrencyFormatPipe, FloorNamePipe } from "../../../../shared/pipes";
import { UnitsService } from '@/core/services';
import { MenuService } from '@/core/services/menu.service';
import { UnitResponse, PagedResult, TenantResponse } from '@/shared/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-unit.component.html'
})

export class NewUnitComponent implements OnInit, OnDestroy {

  private readonly apService = inject(UnitsService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);

  isLoading: boolean = false;
  isLoadingTenants: boolean = false;

  units!: PagedResult<UnitResponse>;
  availableTenants: TenantResponse[] = [];

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadUnits();

    this.menuService.dataReloaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadUnits();
      });
  }

  navTo(route: string) {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUnits() {
    this.isLoading = true;

    this.apService.getUnits().subscribe({
      next: (res) => {
        this.units = res;
        this.isLoading = false;
      }
    })
  }
}
