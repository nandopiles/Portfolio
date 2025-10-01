import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  liveUrl?: string;
  githubUrl?: string;
}

interface FilterCategory {
  name: string;
  key: keyof Project['technologies'];
  items: string[];
}

interface ActiveFilters {
  languages: string[];
  frameworks: string[];
  tools: string[];
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
  activeFilters = signal<ActiveFilters>({
    languages: [],
    frameworks: [],
    tools: []
  });

  projects: Project[] = [
    {
      title: "Modern E-commerce Dashboard",
      description: "A comprehensive admin dashboard built with Angular 20 and Signals for real-time data management. Features include inventory tracking, sales analytics, and user management with a responsive, accessible interface.",
      image: "/modern-ecommerce-dashboard.png",
      technologies: {
        languages: ["TypeScript"],
        frameworks: ["Angular 20", "Signals API"],
        tools: ["SCSS", "Chart.js"]
      },
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Social Media App Interface",
      description: "A sleek social media application interface showcasing modern Angular patterns with reactive forms, lazy loading, and optimized performance. Built with accessibility and mobile-first design principles.",
      image: "/social-media-app-interface.png",
      technologies: {
        languages: ["TypeScript"],
        frameworks: ["Angular", "RxJS"],
        tools: ["Tailwind CSS", "PWA"]
      },
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management Dashboard",
      description: "An intuitive project management tool with drag-and-drop functionality, real-time collaboration features, and comprehensive reporting. Demonstrates advanced Angular concepts and state management.",
      image: "/task-management-dashboard.png",
      technologies: {
        languages: ["TypeScript"],
        frameworks: ["Angular", "NgRx"],
        tools: ["Angular Material", "WebSockets"]
      },
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management Dashboard",
      description: "An intuitive project management tool with drag-and-drop functionality, real-time collaboration features, and comprehensive reporting. Demonstrates advanced Angular concepts and state management.",
      image: "/task-management-dashboard.png",
      technologies: {
        languages: ["TypeScript"],
        frameworks: ["Angular", "NgRx"],
        tools: ["Angular Material", "WebSockets"]
      },
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Task Management Dashboard",
      description: "An intuitive project management tool with drag-and-drop functionality, real-time collaboration features, and comprehensive reporting. Demonstrates advanced Angular concepts and state management.",
      image: "/task-management-dashboard.png",
      technologies: {
        languages: ["TypeScript"],
        frameworks: ["Angular", "NgRx"],
        tools: ["Angular Material", "WebSockets"]
      },
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  // Categorías de filtros
  get filterCategories(): FilterCategory[] {
    const categories: FilterCategory[] = [
      { name: 'Lenguajes', key: 'languages', items: [] },
      { name: 'Frameworks', key: 'frameworks', items: [] },
      { name: 'Herramientas', key: 'tools', items: [] }
    ];

    // Extraer items únicos para cada categoría
    categories.forEach(category => {
      const itemSet = new Set<string>();
      this.projects.forEach(project => {
        project.technologies[category.key].forEach(item => itemSet.add(item));
      });
      category.items = Array.from(itemSet).sort();
    });

    return categories;
  }

  get filteredProjects(): Project[] {
    const filters = this.activeFilters();
    const hasActiveFilters = filters.languages.length > 0 || 
                             filters.frameworks.length > 0 || 
                             filters.tools.length > 0;

    if (!hasActiveFilters) {
      return this.projects;
    }

    return this.projects.filter(project => {
      const matchesLanguages = filters.languages.length === 0 || 
                               filters.languages.some(lang => project.technologies.languages.includes(lang));
      const matchesFrameworks = filters.frameworks.length === 0 || 
                                filters.frameworks.some(fw => project.technologies.frameworks.includes(fw));
      const matchesTools = filters.tools.length === 0 || 
                           filters.tools.some(tool => project.technologies.tools.includes(tool));
      
      return matchesLanguages && matchesFrameworks && matchesTools;
    });
  }

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  toggleFilter(category: keyof Project['technologies'], item: string): void {
    const currentFilters = this.activeFilters();
    const categoryFilters = currentFilters[category];
    
    if (categoryFilters.includes(item)) {
      // Remover filtro
      this.activeFilters.set({
        ...currentFilters,
        [category]: categoryFilters.filter(f => f !== item)
      });
    } else {
      // Agregar filtro
      this.activeFilters.set({
        ...currentFilters,
        [category]: [...categoryFilters, item]
      });
    }
  }

  isFilterActive(category: keyof Project['technologies'], item: string): boolean {
    return this.activeFilters()[category].includes(item);
  }

  clearAllFilters(): void {
    this.activeFilters.set({
      languages: [],
      frameworks: [],
      tools: []
    });
  }

  get hasActiveFilters(): boolean {
    const filters = this.activeFilters();
    return filters.languages.length > 0 || filters.frameworks.length > 0 || filters.tools.length > 0;
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