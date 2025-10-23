import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    
    // Remove todos os caracteres não numéricos
    const cleanPhone = value.replace(/\D/g, '');
    
    // Formata para celular (11 dígitos) - (XX) XXXXX-XXXX
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    // Formata para telefone fixo (10 dígitos) - (XX) XXXX-XXXX
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    // Se não estiver no formato esperado, retorna o valor original
    return value;
  }
}
