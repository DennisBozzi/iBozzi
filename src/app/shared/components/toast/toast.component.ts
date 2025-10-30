import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class ToastComponent {
    toasts$;

    constructor(private toastService: ToastService) {
        this.toasts$ = this.toastService.getToasts();
    }

    close(id: number) {
        this.toastService.remove(id);
    }

    getAlertClass(type: string): string {
        const classes: { [key: string]: string } = {
            'info': 'alert-info',
            'success': 'alert-success',
            'warning': 'alert-warning',
            'error': 'alert-error'
        };
        return classes[type] || 'alert-info';
    }
}
