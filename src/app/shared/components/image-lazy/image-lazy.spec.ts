import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLazy } from './image-lazy';

describe('ImageLazy', () => {
  let component: ImageLazy;
  let fixture: ComponentFixture<ImageLazy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLazy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageLazy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
