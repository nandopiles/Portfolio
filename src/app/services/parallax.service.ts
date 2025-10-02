import { Injectable, ElementRef } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { throttleTime, takeUntil } from 'rxjs/operators';

interface ParallaxElement {
  element: ElementRef;
  speed: number;
  axis: 'x' | 'y' | 'both';
  startPosition: number;
  rotationSpeed?: number;
  scaleSpeed?: number;
  opacitySpeed?: number;
  elementType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParallaxService {
  private parallaxElements: ParallaxElement[] = [];
  private destroy$ = new Subject<void>();
  private isInitialized = false;
  private lastScrollY = 0;
  private scrollDirection = 1;

  constructor() {}

  initializeParallax(): void {
    if (this.isInitialized) return;

    // Escuchar el evento de scroll con mayor frecuencia para más fluidez
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(4), // Aumentamos aún más la frecuencia para movimientos más suaves
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateParallaxElements();
      });

    // También escuchar resize para reajustar posiciones
    fromEvent(window, 'resize')
      .pipe(
        throttleTime(100),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateParallaxElements();
      });

    this.isInitialized = true;
    
    // Ejecutar una vez al inicializar para posicionar elementos
    setTimeout(() => this.updateParallaxElements(), 100);
  }

  registerElement(
    element: ElementRef, 
    speed: number, 
    axis: 'x' | 'y' | 'both' = 'y', 
    startPosition: number = 0,
    rotationSpeed: number = 0,
    scaleSpeed: number = 0,
    opacitySpeed: number = 0,
    elementType: string = ''
  ): void {
    this.parallaxElements.push({
      element,
      speed,
      axis,
      startPosition,
      rotationSpeed,
      scaleSpeed,
      opacitySpeed,
      elementType
    });
  }

  unregisterElement(element: ElementRef): void {
    this.parallaxElements = this.parallaxElements.filter(pe => pe.element !== element);
  }

  private updateParallaxElements(): void {
    const scrollY = window.pageYOffset;
    
    this.parallaxElements.forEach((pe, index) => {
      const element = pe.element.nativeElement;
      
      // SOLO MOVIMIENTO PARALLAX - sin efectos adicionales
      let translateX = 0;
      let translateY = 0;

      // Movimiento vertical principal basado en scroll
      if (pe.axis === 'y' || pe.axis === 'both') {
        translateY = pe.startPosition + (scrollY * pe.speed);
      }
      
      // Movimiento horizontal sutil
      if (pe.axis === 'x' || pe.axis === 'both') {
        translateX = scrollY * pe.speed * 0.3;
      }

      // Movimientos específicos por tipo - SOLO POSICIÓN
      if (pe.elementType === 'paella' || pe.elementType === 'sun') {
        // Elementos redondos se mueven en diagonal
        translateX += Math.sin(scrollY * 0.005) * 10;
      } else if (pe.elementType === 'palm' || pe.elementType === 'tower') {
        // Elementos verticales se mueven lateralmente
        translateX += Math.sin(scrollY * 0.003 + index) * 8;
      } else if (pe.elementType === 'code') {
        // Elementos de código se mueven de forma técnica
        translateX += Math.cos(scrollY * 0.004 + index * 0.5) * 6;
        translateY += Math.sin(scrollY * 0.006 + index * 0.3) * 4;
      } else if (pe.elementType === 'wave') {
        // Las olas se mueven horizontalmente
        translateX += Math.sin(scrollY * 0.008 + index) * 12;
      } else if (pe.elementType === 'orange') {
        // Las naranjas se mueven en círculos pequeños
        translateX += Math.cos(scrollY * 0.007 + index) * 5;
        translateY += Math.sin(scrollY * 0.009 + index) * 3;
      }

      // Aplicar SOLO transformaciones de posición
      element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      
      // Opacidad fija sin cambios
      element.style.opacity = '0.6';
      
      // Sin efectos de color ni brillo
      element.style.filter = 'none';
    });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.parallaxElements = [];
    this.isInitialized = false;
  }
}