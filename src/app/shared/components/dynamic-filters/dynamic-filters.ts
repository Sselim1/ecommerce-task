import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterChangeEvent {
  search: string;
  status: 'all' | 'active' | 'inactive';
  sortField: string;
  sortOrder: 'asc' | 'desc';
}

@Component({
  selector: 'app-dynamic-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFiltersComponent {
  @Input() sortOptions: { value: string; label: string }[] = [];
  @Input() search = '';
  @Input() status: 'all' | 'active' | 'inactive' = 'all';
  @Input() sortField: string = 'name';
  @Input() sortOrder: 'asc' | 'desc' = 'asc';

  @Output() changeFilters = new EventEmitter<FilterChangeEvent>();

  emit() {
    this.changeFilters.emit({
      search: this.search,
      status: this.status,
      sortField: this.sortField,
      sortOrder: this.sortOrder
    });
  }
}

