import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavItem {
  name: string;
  href: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {
  activeSection = signal('');
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  navItems: NavItem[] = [
    { name: 'Sobre Mí', href: '#about' },
    { name: 'Experiencia', href: '#experience' },
    { name: 'Proyectos', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contacto', href: '#contact' },
  ];

  ngOnInit() {
    this.setupScrollListener();
  }

  private setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);

      const sections = this.navItems.map(item => item.href.slice(1));
      let current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      // Si estamos arriba del todo, ningún elemento activo
      if (window.scrollY < 50) {
        current = '';
      }

      this.activeSection.set(current || '');
    });
  }

  isActiveSection(href: string): boolean {
    return this.activeSection() === href.slice(1);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  onMobileNavClick(href: string): void {
    this.closeMobileMenu();
    // Scroll suave al elemento
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}