/**
 * Generic abstraction for working with localStorage
 * Provides type-safety and error handling
 */

export class StorageAdapter<T> {
    constructor(private readonly key: string) { }

    /**
     * Obtiene datos del localStorage
     */
    get(): T | null {
        try {
            const item = localStorage.getItem(this.key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage [${this.key}]:`, error);
            return null;
        }
    }

    /**
     * Obtiene datos del localStorage o retorna un valor por defecto
     */
    getOrDefault(defaultValue: T): T {
        return this.get() ?? defaultValue;
    }

    /**
     * Guarda datos en localStorage
     */
    set(value: T): boolean {
        try {
            localStorage.setItem(this.key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage [${this.key}]:`, error);
            return false;
        }
    }

    /**
     * Elimina datos del localStorage
     */
    remove(): boolean {
        try {
            localStorage.removeItem(this.key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage [${this.key}]:`, error);
            return false;
        }
    }

    /**
     * Verifica si existe el key en localStorage
     */
    exists(): boolean {
        return localStorage.getItem(this.key) !== null;
    }

    /**
     * Updates data using a function
     */
    update(updater: (current: T | null) => T): boolean {
        const current = this.get();
        const updated = updater(current);
        return this.set(updated);
    }
}

