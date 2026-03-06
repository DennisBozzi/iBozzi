import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { TranslatePipe, EnumLabelPipe, CurrencyFormatPipe, CpfPipe } from "../../../../shared/pipes";
import { ToastService, UnitsService, TenantService, ContractsService, NewContract, FileService } from '@/core/services';
import { BreadcrumbItem, ContractResponse, FileModel, FloorEnum, TenantResponse, UnitResponse, UnitType } from '@/shared/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '@/core/services/breadcrumb.service';
import { TenantAutocompleteComponent } from '@/shared/components/tenant-autocomplete/tenant-autocomplete.component';
import { formatFileSize, getDateProgress } from '@/shared/utils';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, EnumLabelPipe, TenantAutocompleteComponent, FormsModule, CurrencyFormatPipe, CpfPipe],
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
  private readonly fileService = inject(FileService);

  id!: number;
  unit!: UnitResponse;
  contract!: ContractResponse;
  tenant!: TenantResponse;
  file!: FileModel;
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
      this.getContractByUnitId();
    });
  }

  getContractByUnitId() {
    this.uniService.getContractByUnitId(this.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res) => {
          this.contract = res;

          if (res?.unit != null) {
            this.unit = res.unit;
            this.setBreadcrumb(this.unit.number);
          }

          if (res.tenant)
            this.tenant = res.tenant;
          else
            this.tenant = undefined as any;

          if (res.file)
            this.file = res.file;
          else
            this.file = undefined as any;
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

  isDownloadingFile: boolean = false;

  downloadContract(fileId: number) {
    if (this.isDownloadingFile) return;
    this.isDownloadingFile = true;

    this.fileService.getFileById(fileId)
      .pipe(finalize(() => { this.isDownloadingFile = false; }))
      .subscribe({
        next: (res) => {
          if (res?.url) {
            window.open(res.url, '_blank');
          } else {
            this.toastService.error('Url não encontrada');
          }
        },
        error: (err) => {
          this.toastService.error(err.message || 'Erro ao baixar arquivo');
        }
      });
  }

  get contractProgress(): number | null {
    if (!this.contract)
      return null

    return getDateProgress(this.contract.validSince, this.contract.validUntil);
  }

  get fileSize(): string | null {
    if (!this.file)
      return null;

    return formatFileSize(this.file.fileSize);
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
      unitId: this.contract.unit?.id
    };

    this.conService.newContract(newContractDto)
      .pipe(finalize(() => { this.isLoadingNewContract = false; }))
      .subscribe({
        next: (res) => {
          this.toastService.success('Contrato criado com sucesso');
          this.closeModal();
          this.getContractByUnitId();
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

  isEndingContract: boolean = false;

  endContract() {
    this.isEndingContract = true;
    this.conService.endContract(this.unit.id)
      .pipe(finalize(() => { this.isEndingContract = false; }))
      .subscribe({
        next: (res) => {
          this.toastService.success('Contrato encerrado com sucesso');
          this.closeEndContractModal();
          this.contract = res;

          if (res?.unit != null) {
            this.unit = res.unit;
          }

          this.tenant = res.tenant as any;
          this.file = res.file as any;
        },
        error: (err) => {
          this.toastService.error(err.message || 'Erro ao encerrar contrato');
        }
      });
  }

  closeEndContractModal() {
    const dialog = document.getElementById('end_contract') as HTMLDialogElement;
    dialog?.close();
  }

  isRenewingContract: boolean = false;
  isRenewSubmitted: boolean = false;
  renewDateStart!: string;
  renewDateEnd!: string;
  renewRent!: number;
  renewPaymentDay!: number;

  openRenewModal() {
    this.renewRent = this.contract.rent;
    this.renewPaymentDay = this.contract.paymentDay;
    this.renewDateStart = '';
    this.renewDateEnd = '';
    this.isRenewSubmitted = false;

    const dialog = document.getElementById('renew_contract') as HTMLDialogElement;
    dialog?.showModal();
  }

  closeRenewModal() {
    const dialog = document.getElementById('renew_contract') as HTMLDialogElement;
    dialog?.close();
  }

  isRenewFieldInvalid(field: any): boolean {
    return this.isRenewSubmitted && !field;
  }

  submitRenewContract() {
    this.isRenewSubmitted = true;

    if (!this.renewDateStart || !this.renewDateEnd || !this.renewPaymentDay) {
      this.toastService.error('Todos os campos são obrigatórios');
      return;
    }

    const startDate = new Date(this.renewDateStart);
    const endDate = new Date(this.renewDateEnd);

    if (startDate >= endDate) {
      this.toastService.error('A data de início deve ser anterior à data de término');
      return;
    }

    if (this.renewPaymentDay < 1 || this.renewPaymentDay > 31) {
      this.toastService.error('O dia de pagamento deve estar entre 1 e 31');
      return;
    }

    this.isRenewingContract = true;

    const renewDto: NewContract = {
      validSince: startDate,
      validUntil: endDate,
      rent: this.renewRent,
      paymentDay: this.renewPaymentDay,
      tenantId: this.tenant.id,
      unitId: this.contract.unit?.id
    };

    this.conService.renewContract(renewDto)
      .pipe(finalize(() => { this.isRenewingContract = false; }))
      .subscribe({
        next: (res) => {
          this.toastService.success('Contrato renovado com sucesso');
          this.closeRenewModal();
          this.contract = res;

          if (res?.unit != null) {
            this.unit = res.unit;
          }

          this.tenant = res.tenant as any;
          this.file = res.file as any;
        },
        error: (err) => {
          this.toastService.error(err.message || 'Erro ao renovar contrato');
        }
      });
  }
}
