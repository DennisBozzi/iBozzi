import { guestGuard } from "@/guards/guest.guard";
import { LoginComponent } from "@/pages/auth/login/login.component";
import { SignupComponent } from "@/pages/auth/signup/signup.component";
import { Routes } from "@angular/router";

export default [
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
] as Routes;