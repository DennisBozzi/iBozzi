import { authGuard } from "@/guards/auth.guard";
import { Routes } from "@angular/router";
import { HomeComponent } from "@/pages/home/home.component";
import { Layout } from "@/layout/layout.component";

export default [
    {
        path: '',
        component: Layout,
        canActivate: [authGuard],
        children: [
            { path: 'home', component: HomeComponent, data: { title: 'Home' } },
        ]
    }
] as Routes;