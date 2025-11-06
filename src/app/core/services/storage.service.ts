import { inject, Injectable } from '@angular/core';
import { STORAGE_TOKEN } from '../tokens/storage.token';

@Injectable({
    providedIn: 'root'
})

export class StorageService {

    private readonly storage = inject(STORAGE_TOKEN);

    set(key: string, value: string) {
        this.storage.setItem(key, value);
    }

    get(key: string) {
        return this.storage.getItem(key);
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

    has(key: string) {
        return Boolean(this.storage.getItem(key));
    }
}