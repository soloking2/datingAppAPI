import { Service } from '@angular/core';

@Service()
export class LocalStorage {
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if(!item) return null;
    return JSON.parse(item) as T;

  }

  setItem<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
