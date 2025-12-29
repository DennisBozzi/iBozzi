import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, EnumLabelPipe } from "../../../../shared/pipes";
import { CreateUnitRequest, ToastService, UnitsService, TranslationService, TenantService } from '@/core/services';
import { BreadcrumbItem, FloorEnum, TenantResponse, UnitResponse, UnitType } from '@/shared/interfaces';
import { floorEnumToSelectOptions } from '@/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '@/core/services/breadcrumb.service';

@Component({
  selector: 'app-tenant',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, EnumLabelPipe],
  templateUrl: './tenant.component.html'
})

export class TenantComponent implements OnInit {

  private readonly uniService = inject(UnitsService);
  private readonly tenService = inject(TenantService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);




  id!: number;
  tenant!: TenantResponse;
  isLoading: boolean = true;


  unit!: UnitResponse;
  form: FormGroup;

  selectedType: number = 0;
  submitted: boolean = false;
  floorOptions = floorEnumToSelectOptions(FloorEnum);
  FloorEnum = FloorEnum;
  UnitTypeEnum = UnitType;

  constructor() {
    this.form = this.initializeForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getUnitById();
    });
  }

  //TODO: Mudar bara getContractById
  getUnitById() {
    this.tenService.getTenantById(this.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res) => {
          this.tenant = res;
          this.setBreadcrumb(this.tenant.firstName + ' ' + this.tenant.lastName);
        },
        error: (err) => {
          this.toastService.error(err.message);
          this.router.navigate(['/tenants']);
        }
      });
  }

  setBreadcrumb(label: string) {
    this.breadcrumbService.setBreadcrumb([
      { label: 'layout.tenants', url: '/tenants' },
      { label: label, url: '/tenants/' + this.id }
    ] as BreadcrumbItem[]);
  }

  selectType(type: number) {
    this.form.patchValue({ type: type });
    this.selectedType = type;
  }

  navTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    window.history.back();
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.isLoading = true;

      const newUnit = {
        number: this.form.get('number')?.value,
        floor: this.form.get('floor')?.value,
        type: this.form.get('type')?.value
      } as CreateUnitRequest;

      this.uniService.newUnit(newUnit)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (res) => {
            const successMessage = this.translationService.translate('units.createUnit.success');
            this.toastService.success(successMessage);
            this.router.navigate(['/units']);
          },
          error: (err) => {
            this.toastService.error(err.error);
          }
        });

    }
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required, Validators.maxLength(30)]],
      floor: ['', Validators.required],
      type: ['', Validators.required]
    });
  }
}
