import { Directive, ElementRef, HostListener } from '@angular/core';
import { maskCpf } from '../utils';

@Directive({
  selector: '[appMaskCpf]',
  standalone: true
})
export class MaskCpfDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const masked = maskCpf(value);
    this.el.nativeElement.value = masked;
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
