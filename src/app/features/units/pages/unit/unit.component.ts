import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, EnumLabelPipe } from "../../../../shared/pipes";
import { CreateUnitRequest, ToastService, UnitsService, TranslationService } from '@/core/services';
import { BreadcrumbItem, FloorEnum, UnitResponse, UnitType } from '@/shared/interfaces';
import { floorEnumToSelectOptions } from '@/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '@/core/services/breadcrumb.service';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, EnumLabelPipe],
  templateUrl: './unit.component.html'
})

export class UnitComponent implements OnInit {

  private readonly uniService = inject(UnitsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly breadcrumbService = inject(BreadcrumbService);


  id!: number;
  unit!: UnitResponse;
  isLoading: boolean = true;

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
    this.uniService.getUnitById(this.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (res) => {
          this.unit = res;
          this.setBreadcrumb(this.unit.number);
        },
        error: (err) => {
          this.toastService.error(err.message);
        }
      });
  }

  setBreadcrumb(label: string) {
    this.breadcrumbService.setBreadcrumb([
      { label: 'layout.units', url: '/units' },
      { label: label, url: '/units/' }
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
