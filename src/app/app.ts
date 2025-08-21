
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

import { ToastComponent } from './shared/components/toast/toast';
import { Store } from '@ngrx/store';
import { ThemeService } from './core/services/theme.service';
import { ToastService } from './core/services/toast.service';
import { AppState } from './store/app.state';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, NgIf, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isDarkMode$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  ngOnInit(): void {
    this.themeService.initializeTheme();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
