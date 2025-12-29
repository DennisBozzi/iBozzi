export function maskCpf(value: string): string {
  if (!value) return '';
  
  const cleaned = value.replace(/\D/g, '');
  return cleaned
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function maskPhone(value: string): string {
  if (!value) return '';
  
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 10) {
    return cleaned
      .slice(0, 10)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  return cleaned
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function removeMask(value: string): string {
  return value.replace(/\D/g, '');
}
