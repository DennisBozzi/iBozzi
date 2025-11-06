import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'menu-toggle-button',
    imports: [],
    templateUrl: './menu-toggle-button.component.html',
    standalone: true
})
export class MenuToggleButtonComponent {
    @Output() mobileToggle = new EventEmitter<void>();
    @Output() desktopToggle = new EventEmitter<void>();

    onMobileToggle() {
        this.mobileToggle.emit();
    }

    onDesktopToggle() {
        this.desktopToggle.emit();
    }
}
