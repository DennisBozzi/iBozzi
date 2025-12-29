import { Directive, ElementRef, HostListener } from '@angular/core';
import { maskPhone } from '../utils';

@Directive({
  selector: '[appMaskPhone]',
  standalone: true
})
export class MaskPhoneDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const masked = maskPhone(value);
    this.el.nativeElement.value = masked;
    this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
