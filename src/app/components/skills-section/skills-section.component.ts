import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillCategory {
  title: string;
  skills: string[];
}

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-section.component.html',
  styleUrl: './skills-section.component.scss'
})
export class SkillsSectionComponent implements OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;
  isVisible = signal(false);

  skillCategories: SkillCategory[] = [
    {
      title: "Frontend Frameworks",
      skills: ["Angular v20", "Angular Signals", "RxJS", "TypeScript", "JavaScript ES6+"],
    },
    {
      title: "State & Forms",
      skills: ["Reactive Forms", "NgRx", "Signals API", "Template-driven Forms"],
    },
    {
      title: "Styling & UI",
      skills: ["Tailwind CSS", "SCSS/SASS", "CSS Grid & Flexbox", "Responsive Design", "Angular Material"],
    },
    {
      title: "Tools & Practices",
      skills: ["Git", "Clean Architecture", "REST APIs", "Performance Optimization", "Accessibility (a11y)"],
    },
  ];

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