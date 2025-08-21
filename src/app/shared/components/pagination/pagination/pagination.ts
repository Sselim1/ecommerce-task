import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
export interface PaginationEvent {
  page: number;
  limit: number;
}
@Component({
  selector: 'app-pagination',
  imports: [CommonModule, NgFor],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Input() total: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  @Input() showPageSizeSelector: boolean = true;
  @Input() maxVisiblePages: number = 5;

  @Output() pageChange = new EventEmitter<PaginationEvent>();

  visiblePages: (number | string)[] = [];
  startItem: number = 0;
  endItem: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['totalPages'] || changes['total'] || changes['pageSize']) {
      this.calculateVisiblePages();
      this.calculateItemRange();
    }
  }

  onPageChange(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit({
        page,
        limit: this.pageSize
      });
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newPageSize = parseInt(target.value, 10);
    
    this.pageChange.emit({
      page: 1, // Reset to first page when changing page size
      limit: newPageSize
    });
  }

  getPageButtonClass(page: number | string): string {
    const baseClass = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 transition-colors';
    
    if (page === this.currentPage) {
      return `${baseClass} z-10 bg-indigo-600 dark:bg-indigo-500 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500`;
    }
    
    return `${baseClass} text-gray-900 dark:text-gray-100`;
  }

  trackByPage(index: number, page: number | string): number | string {
    return page;
  }

  private calculateVisiblePages(): void {
    const pages: (number | string)[] = [];
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const maxVisible = this.maxVisiblePages;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, current - Math.floor((maxVisible - 3) / 2));
      let end = Math.min(totalPages - 1, current + Math.floor((maxVisible - 3) / 2));

      // Adjust if we're near the beginning
      if (current <= Math.ceil(maxVisible / 2)) {
        end = maxVisible - 1;
      }

      // Adjust if we're near the end
      if (current >= totalPages - Math.floor(maxVisible / 2)) {
        start = totalPages - maxVisible + 2;
      }

      // Add ellipsis before middle section if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle section
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after middle section if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    this.visiblePages = pages;
  }

  private calculateItemRange(): void {
    if (this.total === 0) {
      this.startItem = 0;
      this.endItem = 0;
      return;
    }

    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.currentPage * this.pageSize, this.total);
  }
} 