import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FirebaseService } from '@/core/services/firebase.service';

@Component({
    selector: 'layout',
    imports: [RouterOutlet],
    templateUrl: './layout.component.html',
})

export class LayoutComponent {
    title = 'iBozzi';

    private readonly router = inject(Router);
    private readonly firebaseService = inject(FirebaseService);

    async logout() {
        const { error } = await this.firebaseService.signOut();
        if (error) {
            console.error('Error signing out:', error);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
