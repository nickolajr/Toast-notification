import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new Subject<Toast[]>();
  private nextId = 0;

  constructor() { }

  // Get an observable of the toasts array
  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  // Add a new toast notification
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration
    };
    
    this.toasts.push(toast);
    this.toastsSubject.next(this.toasts);
    
    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  // Show a success toast
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  // Show an error toast
  error(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  // Show a warning toast
  warning(message: string, duration: number = 3500): void {
    this.show(message, 'warning', duration);
  }

  // Show an info toast
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  // Remove a toast by id
  remove(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(this.toasts);
  }

  // Clear all toasts
  clear(): void {
    this.toasts = [];
    this.toastsSubject.next(this.toasts);
  }
} 