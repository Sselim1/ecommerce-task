
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Desktop Table Skeleton -->
      <div class="hidden lg:block">
        <div class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <!-- Header -->
          <div class="bg-gray-50 dark:bg-gray-800 px-3 py-2">
            <div class="grid grid-cols-6 gap-4">
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          
          <!-- Rows -->
          <div *ngFor="let item of skeletonItems" class="bg-white dark:bg-gray-900 px-3 py-2">
            <div class="grid grid-cols-6 gap-4 items-center">
              <!-- Image -->
              <div class="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Name -->
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Price -->
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Stock -->
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Status -->
              <div class="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Actions -->
              <div class="flex space-x-2">
                <div class="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div class="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Cards Skeleton -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        <div *ngFor="let item of skeletonItems" class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <div class="flex gap-3">
            <!-- Image -->
            <div class="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse flex-shrink-0"></div>
            <div class="flex-1 space-y-3">
              <!-- Name -->
              <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              <!-- Price and Stock -->
              <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
              <!-- Status -->
              <div class="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <!-- Actions -->
          <div class="mt-4 flex justify-end gap-3">
            <div class="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div class="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSkeletonComponent {
  @Input() count: number = 6;
  
  get skeletonItems(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}

