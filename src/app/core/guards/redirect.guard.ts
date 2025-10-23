import { FirebaseService } from "@/core/services/firebase.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const redirectGuard: CanActivateFn = async (route, state) => {
    const firebaseService = inject(FirebaseService);
    const router = inject(Router);

    const result = await firebaseService.getUser();
    
    if (result.data.user) {
        router.navigate(['/home']);
    } else {
        router.navigate(['/login']);
    }
    
    return false;
};
