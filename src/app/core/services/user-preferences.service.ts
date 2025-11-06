import { Injectable, inject } from '@angular/core';
import { getDatabase, ref, set, get, Database } from 'firebase/database';
import { FirebaseService } from './firebase.service';
import { app } from '../config/firebase.config';
import { Theme } from '@/shared/types/theme.type';

@Injectable({
    providedIn: 'root'
})
export class UserPreferencesService {
    private readonly firebaseService = inject(FirebaseService);
    private readonly database: Database = getDatabase(app);

    async saveTheme(theme: Theme): Promise<void> {
        try {
            const user = this.firebaseService.getCurrentUser();
            if (!user) return;

            const themeRef = ref(this.database, `users/${user.uid}/preferences/theme`);
            await set(themeRef, theme);
        } catch (error) {
            console.error('Erro ao salvar tema no Firebase:', error);
        }
    }

    async getTheme(): Promise<Theme | null> {
        try {
            const user = this.firebaseService.getCurrentUser();
            if (!user) return null;

            const themeRef = ref(this.database, `users/${user.uid}/preferences/theme`);
            const snapshot = await get(themeRef);

            if (snapshot.exists()) {
                return snapshot.val() as Theme;
            }
            return null;
        } catch (error) {
            console.error('Erro ao carregar tema do Firebase:', error);
            return null;
        }
    }
}
