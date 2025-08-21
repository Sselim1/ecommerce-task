import { Component, ChangeDetectionStrategy, Input, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-lazy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-lazy.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageLazyComponent implements OnInit {
  @Input() src!: string;
  @Input() alt: string = '';
  @Input() placeholder: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  loaded = false;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const el = this.host.nativeElement;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loaded = true;
          observer.disconnect();
        }
      });
    });
    observer.observe(el);
  }
}

