import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillCategory {
  title: string;
  skills: string[];
  description?: string;
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
      title: "Frontend",
      skills: [
        "Angular v20", "TypeScript", "JavaScript (ES6+)", "RxJS", "PrimeNg", "Tailwind CSS", "Bootstrap"
      ]
    },
    {
      title: "Backend",
      skills: [
        "Java", ".NET", "Python", "Symfony", "Flask", "MongoDb", "REST APIs", "JWT Auth", "MySQL"
      ]
    },
    {
      title: "Herramientas",
      skills: [
        "Git", "GitHub", "Hibernate", "Postman", "Jira"
      ]
    }
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