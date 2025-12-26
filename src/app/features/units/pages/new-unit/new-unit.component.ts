import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from "../../../../shared/pipes";
import { CreateUnitRequest, ToastService, UnitsService, TranslationService } from '@/core/services';
import { FloorEnum } from '@/shared/interfaces';
import { floorEnumToSelectOptions } from '@/shared/utils';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-unit',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './new-unit.component.html'
})

export class NewUnitComponent {

  private readonly uniService = inject(UnitsService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  form: FormGroup;

  isLoading: boolean = false;
  selectedType: number = 0;
  submitted: boolean = false;
  floorOptions = floorEnumToSelectOptions(FloorEnum);

  constructor() {
    this.form = this.initializeForm();
  }

  selectType(type: number) {
    this.form.patchValue({ type: type });
    this.selectedType = type;
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

  navTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    window.history.back();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required, Validators.maxLength(30)]],
      floor: ['', Validators.required],
      type: ['', Validators.required]
    });
  }
}
