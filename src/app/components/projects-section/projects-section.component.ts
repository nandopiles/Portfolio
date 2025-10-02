import { Component, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTagsComponent } from './components/project-tags/project-tags.component';
import { ModalCarouselComponent } from './components/modal-carousel/modal-carousel.component';
import { ActiveFilters, FilterCategory, Project } from './interfaces/project.interface';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule, ProjectTagsComponent, ModalCarouselComponent],
  templateUrl: './projects-section.component.html',
  styleUrl: './projects-section.component.scss'
})
export class ProjectsSectionComponent implements OnInit {
  @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;
  isVisible = signal(false);
  isModalOpen = signal(false);
  selectedProject = signal<Project | null>(null);
  activeFilters = signal<ActiveFilters>({
    languages: [],
    frameworks: [],
    tools: []
  });

  projects: Project[] = [
    {
      id: 0,
      title: "Nayeli Online Shop",
      description: "Nayeli es una tienda en línea compuesta por dos aplicaciones principales: una API creada con Flask y Nayeli Online Store, creada con Angular19.",
      image: "/nayeli/nayeli-img.jpeg",
      galleryImages: [
        "/nayeli/nayeli-img.jpeg",
        "/nayeli/grid.jpeg",
        "/nayeli/detail.jpeg",
        "/nayeli/cart.jpeg",
        "/nayeli/contact.jpeg",
      ],
      technologies: {
        languages: ["TypeScript", "Python"],
        frameworks: ["Angular19+", "Flask", "Tailwind CSS"],
        tools: ["SQLAlchemy", "MySQL", "Clever Cloud"]
      },
      githubUrl: "https://github.com/nandopiles/nayeli"
    },
    {
      id: 1,
      title: "Estimat",
      description: "Rediseño de la página web de la fundación contra el cáncer Estimat.Además de crear una aplicación interna para la gestión de la misma.",
      image: "/estimat/estimat-img.jpeg",
      galleryImages: [
        "/estimat/home.jpeg",
        "/estimat/register.jpeg",
        "/estimat/gallery.jpeg",
        "/estimat/profile.jpeg"
      ],
      technologies: {
        languages: ["TypeScript", "PHP"],
        frameworks: ["Angular19+", "Symfony", "Bootstrap"],
        tools: ["Figma", "Docker"]
      },
      githubUrl: "https://github.com/nandopiles/Estimat"
    },
    {
      id: 2,
      title: "Dietet",
      description: "Explora y filtra una amplia variedad de recetas según su nivel de salud. Guarda tus favoritas, accede a guías paso a paso y reúne los ingredientes que necesitas para disfrutar de una experiencia culinaria saludable. Simplifica tu camino hacia una alimentación equilibrada con Dietet.",
      image: "/dietet/dietet-img.jpeg",
      galleryImages: [
        "/dietet/grid.jpeg",
        "/dietet/detail.jpeg",
        "/dietet/sidebar.jpeg",
      ],
      technologies: {
        languages: ["Javascript"],
        frameworks: ["Node.js", "Bootstrap"],
        tools: ["MongoDb", "Electron"]
      },
      githubUrl: "https://github.com/nandopiles/Dietet"
    },
    {
      id: 3,
      title: "PassGenerator",
      description: "Genera una contraseña totalmente personalizable y segura con PassGenerator. Puedes guardar la contraseña generada con el correo electrónico y el enlace web para acceder a ella. Puedes eliminar las contraseñas cuando quieras.",
      image: "/passgenerator/passgenerator-img.jpeg",
      galleryImages: [
        "/passgenerator/passgenerator-img.jpeg",
        "/passgenerator/options.jpeg",
        "/passgenerator/save.jpeg",
        "/passgenerator/history.jpeg"
      ],
      technologies: {
        languages: ["Javascript"],
        frameworks: ["Bootstrap"],
        tools: ["Sweetalerts2"]
      },
      githubUrl: "https://github.com/nandopiles/RandomPwdGenerator"
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
      // OR entre categorías: si alguna categoría coincide, mostrar el proyecto
      const matchesLanguages = filters.languages.length > 0 &&
        filters.languages.some(lang => project.technologies.languages.includes(lang));
      const matchesFrameworks = filters.frameworks.length > 0 &&
        filters.frameworks.some(fw => project.technologies.frameworks.includes(fw));
      const matchesTools = filters.tools.length > 0 &&
        filters.tools.some(tool => project.technologies.tools.includes(tool));

      // Si no hay filtros activos, ya se retorna arriba
      return matchesLanguages || matchesFrameworks || matchesTools;
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

  openModal(project: Project): void {
    this.selectedProject.set(project);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedProject.set(null);
  }

  private setupIntersectionObserver() {
    // Mostrar antes en móvil: si pantalla < 768px, mostrar directamente
    if (window.innerWidth < 768) {
      this.isVisible.set(true);
      return;
    }
    // En desktop, mostrar antes al hacer scroll (umbral más bajo)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 } // Mostrar mucho antes
    );
    if (this.sectionRef?.nativeElement) {
      observer.observe(this.sectionRef.nativeElement);
    }
  }
}