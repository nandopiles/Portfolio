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

  navItems: NavItem[] = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  ngOnInit() {
    this.setupScrollListener();
  }

  private setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);

      const sections = this.navItems.map(item => item.href.slice(1));
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        this.activeSection.set(current);
      }
    });
  }

  isActiveSection(href: string): boolean {
    return this.activeSection() === href.slice(1);
  }
}