import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { TranslatePipe, EnumLabelPipe } from "../../../../shared/pipes";
import { ToastService, UnitsService, TenantService, ContractsService, NewContract } from '@/core/services';
import { BreadcrumbItem, FloorEnum, TenantResponse, UnitResponse, UnitType } from '@/shared/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '@/core/services/breadcrumb.service';
import { TenantAutocompleteComponent } from '@/shared/components/tenant-autocomplete/tenant-autocomplete.component';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, EnumLabelPipe, TenantAutocompleteComponent, FormsModule],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss'
})

export class UnitComponent implements OnInit {

  private readonly uniService = inject(UnitsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly tenService = inject(TenantService);
  private readonly conService = inject(ContractsService);

  id!: number;
  unit!: UnitResponse;
  isLoading: boolean = true;
  tab: number = 1;

  isAddingTenant: boolean = true;

  FloorEnum = FloorEnum;
  UnitTypeEnum = UnitType;

  constructor() {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getUnitById();
    });
  }

  //TODO: Mudar para getContractById
  getUnitById() {
    this.uniService.getUnitById(this.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res) => {
          this.unit = res;
          this.setBreadcrumb(this.unit.number);
        },
        error: (err) => {
          this.toastService.error(err.message);
          this.router.navigate(['/units']);
        }
      });
  }

  setBreadcrumb(label: string) {
    this.breadcrumbService.setBreadcrumb([
      { label: 'layout.units', url: '/units' },
      { label: label, url: '/units/' + this.id }
    ] as BreadcrumbItem[]);
  }

  navTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    window.history.back();
  }

  setTab(value: number) {
    this.tab = value;
  }

  tenantId!: number;
  dateStart!: string;
  dateEnd!: string;
  rent!: number;
  paymentDay!: number;

  // Tenants Autocomplete
  filteredTenants: TenantResponse[] = [];
  isLoadingTenants = false;

  onSearchTenant(searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      this.filteredTenants = [];
      return;
    }

    this.isLoadingTenants = true;
    this.tenService.getAvailable(1, 10, searchTerm)
      .pipe(finalize(() => { this.isLoadingTenants = false; }))
      .subscribe({
        next: (res) => {
          this.filteredTenants = res.items;
        },
        error: (err) => {
          this.toastService.error(err.message);
          this.filteredTenants = [];
        }
      });
  }

  onSelectTenant(tenant: TenantResponse) {
    this.tenantId = tenant.id;
  }


  isLoadingNewContract: boolean = false;
  isSubmitted: boolean = false;

  isFieldInvalid(field: any): boolean {
    return this.isSubmitted && !field;
  }

  submitNewContract() {
    this.isSubmitted = true;

    // Validar campos obrigatórios
    if (!this.tenantId || !this.dateStart || !this.dateEnd || !this.rent || !this.paymentDay) {
      this.toastService.error('Todos os campos são obrigatórios');
      return;
    }

    const startDate = new Date(this.dateStart);
    const endDate = new Date(this.dateEnd);

    if (startDate >= endDate) {
      this.toastService.error('A data de início deve ser anterior à data de término');
      return;
    }

    // Validar rent e paymentDay
    if (this.rent <= 0) {
      this.toastService.error('O aluguel deve ser maior que zero');
      return;
    }

    if (this.paymentDay < 1 || this.paymentDay > 31) {
      this.toastService.error('O dia de pagamento deve estar entre 1 e 31');
      return;
    }

    this.isLoadingNewContract = true;

    const newContractDto: NewContract = {
      validSince: startDate,
      validUntil: endDate,
      rent: this.rent,
      paymentDay: this.paymentDay,
      tenantId: this.tenantId,
      unitId: this.id
    };

    this.conService.newContract(newContractDto)
      .pipe(finalize(() => { this.isLoadingNewContract = false; }))
      .subscribe({
        next: (res) => {
          this.toastService.success('Contrato criado com sucesso');
          this.closeModal();
          this.getUnitById();
        },
        error: (err) => {
          this.toastService.error(err.message || 'Erro ao criar contrato');
        }
      });
  }

  closeModal() {
    const dialog = document.getElementById('new_contract') as HTMLDialogElement;
    dialog?.close();
    this.tenantId = 0;
    this.dateStart = '';
    this.dateEnd = '';
    this.rent = 0;
    this.paymentDay = 0;
    this.isSubmitted = false;
    this.onSearchTenant('');
  }
}
