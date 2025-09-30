import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent implements OnInit {
  isVisible = signal(false);

  ngOnInit() {
    // Animación de entrada de texto
    setTimeout(() => {
      this.isVisible.set(true);
    }, 100);
  }
}