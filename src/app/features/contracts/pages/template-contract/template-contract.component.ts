import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from "../../../../shared/pipes";
import { ContractsService } from '@/core/services';
import { ContractModelResponse } from '@/shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-contract',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './template-contract.component.html'
})

export class TemplateContractComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly conService = inject(ContractsService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  contract!: ContractModelResponse;
  isLoading: boolean = false;
  isLoadingFill: boolean = false;

  ngOnInit(): void {
    this.getContractTemplate();
  }

  getContractTemplate() {
    this.isLoading = true;
    this.conService.getContractModel().subscribe({
      next: (res) => {
        this.contract = res;
        this.isLoading = false;
      }
    })
  }

  changeContractTemplate() {
    const file = this.fileInput.nativeElement.files?.[0];
    if (!file) return;

    this.isLoading = true;
    this.conService.uploadContractModel(file).subscribe({
      next: (res) => {
        this.contract = res;
        this.isLoading = false;
      }
    })
  }

  fillContract() {
    const values: Record<string, string> = {};
    
    const inputs = document.querySelectorAll('.contract-param-input') as NodeListOf<HTMLInputElement>;
    inputs.forEach((input) => {
      const paramName = input.getAttribute('data-param');
      if (paramName) {
        values[paramName] = input.value;
      }
    });

    this.isLoadingFill = true;
    this.conService.fillContractModel(values).subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'contrato_preenchido.docx');
        this.isLoadingFill = false;
      },
      error: () => {
        this.isLoadingFill = false;
      }
    });
  }

  private downloadFile(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  navTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    window.history.back();
  }
}

