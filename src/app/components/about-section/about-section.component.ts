import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.component.html',
  styleUrl: './about-section.component.scss'
})
export class AboutSectionComponent implements OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;
  isVisible = signal(false);

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
        }
      },
      { threshold: 0.2 }
    );

    if (this.sectionRef?.nativeElement) {
      observer.observe(this.sectionRef.nativeElement);
    }
  }
}