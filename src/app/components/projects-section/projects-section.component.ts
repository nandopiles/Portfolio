import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss'
})
export class ProjectsSectionComponent implements OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;
  isVisible = signal(false);

  projects: Project[] = [
    {
      title: "Modern E-commerce Dashboard",
      description: "A comprehensive admin dashboard built with Angular 20 and Signals for real-time data management. Features include inventory tracking, sales analytics, and user management with a responsive, accessible interface.",
      image: "/modern-ecommerce-dashboard.png",
      technologies: ["Angular 20", "TypeScript", "Signals API", "SCSS", "Chart.js"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Social Media App Interface",
      description: "A sleek social media application interface showcasing modern Angular patterns with reactive forms, lazy loading, and optimized performance. Built with accessibility and mobile-first design principles.",
      image: "/social-media-app-interface.png",
      technologies: ["Angular", "RxJS", "Reactive Forms", "Tailwind CSS", "PWA"],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management Dashboard",
      description: "An intuitive project management tool with drag-and-drop functionality, real-time collaboration features, and comprehensive reporting. Demonstrates advanced Angular concepts and state management.",
      image: "/task-management-dashboard.png",
      technologies: ["Angular", "NgRx", "Angular Material", "WebSockets", "TypeScript"],
      liveUrl: "#",
      githubUrl: "#"
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