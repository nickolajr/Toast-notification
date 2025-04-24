import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('toastAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => visible', animate('300ms ease-out')),
      transition('visible => void', animate('200ms ease-in'))
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Remove a toast from the view
  removeToast(id: number): void {
    this.toastService.remove(id);
  }

  // Get the appropriate icon for each toast type
  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-check-circle';
      case 'error':
        return 'fa-solid fa-circle-exclamation';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'info':
      default:
        return 'fa-solid fa-info-circle';
    }
  }

  // Calculate animation duration for progress bar based on toast duration
  getProgressBarStyle(toast: Toast): object {
    const duration = toast.duration || 3000;
    return {
      'animation-duration': `${duration}ms`
    };
  }
} 

//example of use
//this.showToast(`Added "${book.title.english || book.title.romaji}" to your library`, 'success');