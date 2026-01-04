import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from "../../../../shared/pipes";
import { ToastService, TranslationService, TenantService } from '@/core/services';
import { MaskCpfDirective, MaskPhoneDirective } from '@/shared/directives';
import { removeMask } from '@/shared/utils';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-tenant',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule, MaskCpfDirective, MaskPhoneDirective],
  templateUrl: './new-tenant.component.html'
})

export class NewTenantComponent {

  private readonly tenService = inject(TenantService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  form: FormGroup;

  isLoading: boolean = false;
  selectedGender: number = 0;
  selectedMarital: number = 0;
  submitted: boolean = false;

  constructor() {
    this.form = this.initializeForm();
  }

  selectGender(gender: number) {
    this.form.patchValue({ gender: gender });
    this.selectedGender = gender;
  }

  selectMarital(marital: number) {
    this.form.patchValue({ maritalStatus: marital });
    this.selectedMarital = marital;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      this.isLoading = true;

      const newTenant = {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value,
        cpf: removeMask(this.form.get('cpf')?.value),
        email: this.form.get('email')?.value,
        phone: removeMask(this.form.get('phone')?.value),
        born: this.form.get('born')?.value,
        gender: this.form.get('gender')?.value,
        maritalStatus: this.form.get('maritalStatus')?.value
      };

      this.tenService.newTenant(newTenant)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (res) => {
            const successMessage = this.translationService.translate('tenants.createTenant.success');
            this.toastService.success(successMessage);
            this.router.navigate(['/tenants']);
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
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      cpf: ['', [Validators.required, Validators.maxLength(14)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      born: ['', Validators.required],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required]
    });
  }
}
