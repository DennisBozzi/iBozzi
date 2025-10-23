import { FirebaseService } from "@/core/services/firebase.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const guestGuard: CanActivateFn = async (route, state) => {
    const firebaseService = inject(FirebaseService);
    const router = inject(Router);

    const result = await firebaseService.getUser();
    if (result.data.user) {
        const returnUrl = route.queryParams['returnUrl'];
        if (returnUrl) {
            router.navigateByUrl(returnUrl);
        } else {
            router.navigate(['/home']);
        }
        return false;
    }
    return true;
};