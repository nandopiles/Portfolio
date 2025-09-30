import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';

interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
  tech: string[];
}

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent implements OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;

  private _isVisible = signal(false);
  isVisible = this._isVisible.asReadonly();

  experiences: Experience[] = [
    {
      period: '2023 — Present',
      title: 'Senior Frontend Developer',
      company: 'Tech Innovations Inc.',
      description:
        'Leading frontend development for enterprise applications using Angular 20. Architecting scalable solutions with Signals and RxJS, mentoring junior developers, and implementing best practices for performance optimization.',
      tech: ['Angular 20', 'Signals', 'RxJS', 'TypeScript', 'Tailwind CSS'],
    },
    {
      period: '2021 — 2023',
      title: 'Frontend Developer',
      company: 'Digital Solutions Ltd.',
      description:
        'Developed and maintained multiple client-facing applications using Angular. Implemented reactive forms, state management with NgRx, and collaborated with UX designers to create intuitive user interfaces.',
      tech: ['Angular', 'NgRx', 'Reactive Forms', 'SCSS', 'REST APIs'],
    },
    {
      period: '2019 — 2021',
      title: 'Junior Frontend Developer',
      company: 'StartUp Ventures',
      description:
        'Built responsive web applications and contributed to the development of reusable component libraries. Gained expertise in modern JavaScript frameworks and agile development methodologies.',
      tech: ['Angular', 'JavaScript', 'HTML/CSS', 'Git', 'Agile'],
    },
  ];

  ngOnInit(): void {
    if (this.sectionRef) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this._isVisible.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(this.sectionRef.nativeElement);
    }
  }
}