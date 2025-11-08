import { Injectable, inject } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, Auth, updateProfile, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, linkWithPopup } from 'firebase/auth';
import { getDatabase, ref, get, set, onValue, off, Database } from 'firebase/database';
import { FirebaseStorage, getDownloadURL, getStorage, uploadBytes, ref as stRef } from 'firebase/storage';
import { auth, app } from '../config/firebase.config';
import imageCompression from 'browser-image-compression';
import { LoginPayload, User } from '@/shared/types/user.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FirebaseService {
    private readonly auth: Auth;
    private readonly database: Database;
    private readonly storage: FirebaseStorage;
    private readonly googleProvider: GoogleAuthProvider;
    private readonly githubProvider: GithubAuthProvider;
    private userCache: FirebaseUser | null | undefined = undefined;
    private userWithClaims: User | null | undefined = undefined;
    private authInitialized = false;
    private themeService: any;
    private userSubject = new BehaviorSubject<User | null>(null);
    public user$ = this.userSubject.asObservable();

    constructor() {
        this.auth = auth;
        this.database = getDatabase(app);
        this.storage = getStorage(app);
        this.googleProvider = new GoogleAuthProvider();
        this.githubProvider = new GithubAuthProvider();

        this.initAuthStateListener();
    }

    setThemeService(themeService: any): void {
        this.themeService = themeService;
    }

    private initAuthStateListener(): void {
        onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
            this.userCache = firebaseUser;

            if (firebaseUser) {
                this.userWithClaims = await this.mapFirebaseUserToUser(firebaseUser);
            } else {
                this.userWithClaims = null;
            }

            this.authInitialized = true;
            this.userSubject.next(this.userWithClaims);

            if (firebaseUser && this.themeService) {
                await this.themeService.loadAndApplyTheme();
            }
        });
    }

    // Auth
    async signInWithEmail(payload: LoginPayload) {
        try {
            const userCredential = await signInWithEmailAndPassword(
                this.auth,
                payload.email,
                payload.password
            );
            this.userCache = userCredential.user;
            this.userWithClaims = await this.mapFirebaseUserToUser(userCredential.user);
            return { data: { user: userCredential.user }, error: null };
        } catch (error: any) {
            let errorMessage = error.message;
            return { data: { user: null }, error: { message: errorMessage, code: error.code } };
        }
    }

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            this.userCache = user;
            this.userWithClaims = await this.mapFirebaseUserToUser(user);
            return { data: { user: user }, error: null };
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;

            return { data: { user: null }, error: { message: errorMessage, code: errorCode } };
        }
    }

    async signInWithGithub() {
        try {
            const result = await signInWithPopup(this.auth, this.githubProvider);
            const user = result.user;
            this.userCache = user;
            this.userWithClaims = await this.mapFirebaseUserToUser(user);
            return { data: { user: user }, error: null };
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;

            return { data: { user: null }, error: { message: errorMessage, code: errorCode } };
        }
    }

    async signUpWithEmail(payload: LoginPayload) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                this.auth,
                payload.email,
                payload.password
            );
            this.userCache = userCredential.user;
            this.userWithClaims = await this.mapFirebaseUserToUser(userCredential.user);
            return { data: { user: userCredential.user }, error: null };
        } catch (error: any) {
            let errorMessage = error.message;
            return { data: { user: null }, error: { message: errorMessage, code: error.code } };
        }
    }

    async signOut() {
        try {
            await signOut(this.auth);
            this.userCache = null;
            this.userWithClaims = null;
            return { error: null };
        } catch (error: any) {
            return { error: { message: error.message } };
        }
    }

    onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
        return onAuthStateChanged(this.auth, callback);
    }

    //User
    async getUser(): Promise<{ data: { user: User | null } }> {
        if (this.authInitialized && this.userWithClaims !== undefined)
            return Promise.resolve({ data: { user: this.userWithClaims ?? null } });

        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(this.auth, async (firebaseUser: FirebaseUser | null) => {
                unsubscribe();
                this.userCache = firebaseUser;

                if (firebaseUser) {
                    this.userWithClaims = await this.mapFirebaseUserToUser(firebaseUser);
                } else {
                    this.userWithClaims = null;
                }

                this.authInitialized = true;
                resolve({ data: { user: this.userWithClaims } });
            });
        });
    }

    getCurrentUser(): User | null {
        return this.userWithClaims ?? null;
    }

    async updateProfile(userName: string) {
        if (!this.auth.currentUser)
            throw new Error('Usuário não autenticado');

        await updateProfile(this.auth.currentUser, {
            displayName: userName
        });

        await this.auth.currentUser.reload();
        this.userCache = this.auth.currentUser;
        this.userWithClaims = await this.mapFirebaseUserToUser(this.auth.currentUser);
        this.userSubject.next(this.userWithClaims);
    }

    async linkGithubAccount() {
        try {
            if (!this.auth.currentUser) {
                throw new Error('Usuário não autenticado');
            }
            const result = await linkWithPopup(this.auth.currentUser, this.githubProvider);
            this.userCache = result.user;
            this.userWithClaims = await this.mapFirebaseUserToUser(result.user);
            this.userSubject.next(this.userWithClaims);
            return { data: { user: result.user }, error: null };
        } catch (error: any) {
            return { data: { user: null }, error: { message: error.message, code: error.code } };
        }
    }

    async linkGoogleAccount() {
        try {
            if (!this.auth.currentUser) {
                throw new Error('Usuário não autenticado');
            }
            const result = await linkWithPopup(this.auth.currentUser, this.googleProvider);
            this.userCache = result.user;
            this.userWithClaims = await this.mapFirebaseUserToUser(result.user);
            this.userSubject.next(this.userWithClaims);
            return { data: { user: result.user }, error: null };
        } catch (error: any) {
            return { data: { user: null }, error: { message: error.message, code: error.code } };
        }
    }

    //Storage
    async uploadProfilePhoto(file: File) {
        if (!this.auth.currentUser)
            throw new Error('Usuário não autenticado');

        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 480,
            useWebWorker: true
        };

        file = await imageCompression(file, options);

        const storageRef = stRef(this.storage, `profile-photos/${this.auth.currentUser.uid}/profile`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateProfile(this.auth.currentUser, {
            photoURL: downloadURL
        });

        await this.auth.currentUser.reload();
        this.userCache = this.auth.currentUser;
        this.userWithClaims = await this.mapFirebaseUserToUser(this.auth.currentUser);
        this.userSubject.next(this.userWithClaims);

        return { data: downloadURL, error: null };
    }

    //Realtime Database
    async getLedState(): Promise<{ data: boolean | null, error: any }> {
        try {
            const ledRef = ref(this.database, 'esp32/led');
            const snapshot = await get(ledRef);

            if (snapshot.exists()) {
                const value = snapshot.val();
                return { data: value === true || value === 'true', error: null };
            } else {
                return { data: null, error: { message: 'No data available' } };
            }
        } catch (error: any) {
            return { data: null, error: { message: error.message, code: error.code } };
        }
    }

    async setLedState(state: boolean): Promise<{ success: boolean, error: any }> {
        try {
            const ledRef = ref(this.database, 'esp32/led');
            await set(ledRef, state);
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: { message: error.message, code: error.code } };
        }
    }

    async setColor(color: { r: number, g: number, b: number }): Promise<{ success: boolean, error: any }> {
        try {
            const colorRef = ref(this.database, 'esp32/color');
            await set(colorRef, color);
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: { message: error.message, code: error.code } };
        }
    }

    async setBrightness(value: number): Promise<{ success: boolean, error: any }> {
        try {
            const brightnessRef = ref(this.database, 'esp32/brightness');
            await set(brightnessRef, value);
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: { message: error.message, code: error.code } };
        }
    }

    onLedStateChanged(callback: (state: boolean | null) => void): () => void {
        const ledRef = ref(this.database, 'esp32/led');

        const unsubscribe = onValue(ledRef, (snapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                callback(value === true || value === 'true');
            } else {
                callback(null);
            }
        });

        return () => off(ledRef, 'value', unsubscribe);
    }

    onColorChanged(callback: (color: { r: number, g: number, b: number } | null) => void): () => void {
        const colorRef = ref(this.database, 'esp32/color');

        const unsubscribe = onValue(colorRef, (snapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                callback(value);
            } else {
                callback(null);
            }
        });

        return () => off(colorRef, 'value', unsubscribe);
    }

    onBrightnessChanged(callback: (value: number | null) => void): () => void {
        const brightnessRef = ref(this.database, 'esp32/brightness');

        const unsubscribe = onValue(brightnessRef, (snapshot) => {
            if (snapshot.exists()) {
                const value = snapshot.val();
                callback(value);
            } else {
                callback(null);
            }
        });

        return () => off(brightnessRef, 'value', unsubscribe);
    }

    getFirebaseToken(): Promise<string | null> {
        return new Promise((resolve) => {
            const request = indexedDB.open('firebaseLocalStorageDb');

            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
                const store = transaction.objectStore('firebaseLocalStorage');
                const getRequest = store.get('firebase:authUser:AIzaSyBmfCx1pvjgXxTJDhYvBb_g8bvUIWaoq84:[DEFAULT]');
                getRequest.onsuccess = () => {
                    const data = getRequest.result;
                    if (data && data.value)
                        resolve(data.value.stsTokenManager.accessToken);

                };
            };
        });
    }

    private async mapFirebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> {
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const adminClaim = (idTokenResult.claims as any)?.['admin'] as boolean | undefined;

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            admin: adminClaim ?? false,
            providerData: firebaseUser.providerData
        };
    }
}