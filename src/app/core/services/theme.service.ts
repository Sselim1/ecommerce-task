import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'prefers-dark';
  private readonly darkModeSubject = new BehaviorSubject<boolean>(false);
  readonly isDarkMode$ = this.darkModeSubject.asObservable();

  initializeTheme(): void {
    const stored = localStorage.getItem(this.storageKey);
    const prefersDark = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setDarkMode(prefersDark);
  }

  toggleTheme(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  private setDarkMode(enabled: boolean): void {
    this.darkModeSubject.next(enabled);
    localStorage.setItem(this.storageKey, String(enabled));
    document.documentElement.classList.toggle('dark', enabled);
  }
}

