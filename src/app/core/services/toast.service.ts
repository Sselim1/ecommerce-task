import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private idCounter = 1;

  showSuccess(message: string) {
    this.push({ message, type: 'success' });
  }
  showError(message: string) {
    this.push({ message, type: 'error' });
  }
  showInfo(message: string) {
    this.push({ message, type: 'info' });
  }

  dismiss(id: number) {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }

  private push(input: Omit<Toast, 'id'>) {
    const toast: Toast = { id: this.idCounter++, ...input };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.dismiss(toast.id), 3000);
  }
}

