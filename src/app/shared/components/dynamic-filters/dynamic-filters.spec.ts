import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFilters } from './dynamic-filters';

describe('DynamicFilters', () => {
  let component: DynamicFilters;
  let fixture: ComponentFixture<DynamicFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
