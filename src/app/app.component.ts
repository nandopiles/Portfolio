import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { ParallaxService } from './services/parallax.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    SkillsSectionComponent,
    ProjectsSectionComponent,
    ExperienceSectionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'portfolio';

  // Referencias a elementos parallax del lado izquierdo
  @ViewChild('leftElement1') leftElement1!: ElementRef;
  @ViewChild('leftElement2') leftElement2!: ElementRef;
  @ViewChild('leftElement3') leftElement3!: ElementRef;
  @ViewChild('leftElement4') leftElement4!: ElementRef;
  @ViewChild('leftElement5') leftElement5!: ElementRef;
  @ViewChild('leftElement6') leftElement6!: ElementRef;

  // Referencias a elementos parallax del lado derecho
  @ViewChild('rightElement1') rightElement1!: ElementRef;
  @ViewChild('rightElement2') rightElement2!: ElementRef;
  @ViewChild('rightElement3') rightElement3!: ElementRef;
  @ViewChild('rightElement4') rightElement4!: ElementRef;
  @ViewChild('rightElement5') rightElement5!: ElementRef;
  @ViewChild('rightElement6') rightElement6!: ElementRef;

  constructor(private parallaxService: ParallaxService) {}

  ngOnInit(): void {
    this.parallaxService.initializeParallax();
  }

  ngAfterViewInit(): void {
    // Esperar un momento para que los elementos estén renderizados
    setTimeout(() => {
      // Registrar elementos del lado izquierdo - SOLO MOVIMIENTO
      this.parallaxService.registerElement(this.leftElement1, -0.8, 'y', 100, 0, 0, 0, 'orange');
      this.parallaxService.registerElement(this.leftElement2, 1.2, 'y', 200, 0, 0, 0, 'paella');
      this.parallaxService.registerElement(this.leftElement3, -0.6, 'y', 350, 0, 0, 0, 'palm');
      this.parallaxService.registerElement(this.leftElement4, 1.5, 'y', 500, 0, 0, 0, 'code');
      this.parallaxService.registerElement(this.leftElement5, -0.4, 'y', 700, 0, 0, 0, 'orange');
      this.parallaxService.registerElement(this.leftElement6, 1.0, 'y', 900, 0, 0, 0, 'tower');

      // Registrar elementos del lado derecho - SOLO MOVIMIENTO
      this.parallaxService.registerElement(this.rightElement1, 1.3, 'y', 150, 0, 0, 0, 'code');
      this.parallaxService.registerElement(this.rightElement2, -0.7, 'y', 300, 0, 0, 0, 'orange');
      this.parallaxService.registerElement(this.rightElement3, 0.9, 'y', 450, 0, 0, 0, 'sun');
      this.parallaxService.registerElement(this.rightElement4, -1.1, 'y', 600, 0, 0, 0, 'code');
      this.parallaxService.registerElement(this.rightElement5, 0.5, 'y', 800, 0, 0, 0, 'wave');
      this.parallaxService.registerElement(this.rightElement6, -0.8, 'y', 1000, 0, 0, 0, 'tower');
    }, 200);
  }

  ngOnDestroy(): void {
    this.parallaxService.destroy();
  }
}
