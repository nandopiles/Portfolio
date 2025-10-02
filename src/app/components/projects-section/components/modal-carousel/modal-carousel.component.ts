import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../interfaces/project.interface';

@Component({
  selector: 'app-modal-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-carousel.component.html',
  styleUrl: './modal-carousel.component.scss'
})
export class ModalCarouselComponent implements OnInit, OnDestroy {
  @Input() project: Project | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  currentImageIndex = signal(0);
  isClosing = signal(false);

  ngOnInit() {
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', this.handleKeydown);
  }

  get images(): string[] {
    if (!this.project) return [];
    if (this.project.galleryImages && this.project.galleryImages.length > 0) {
      return this.project.galleryImages;
    }
    return Array(1).fill(this.project.image);
  }

  get currentImage(): string {
    const images = this.images;
    return images[this.currentImageIndex()] || '';
  }

  nextImage(): void {
    const nextIndex = (this.currentImageIndex() + 1) % this.images.length;
    this.currentImageIndex.set(nextIndex);
  }

  previousImage(): void {
    const prevIndex = this.currentImageIndex() === 0 
      ? this.images.length - 1 
      : this.currentImageIndex() - 1;
    this.currentImageIndex.set(prevIndex);
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex.set(index);
    }
  }

  onClose(): void {
    this.isClosing.set(true);
    
    // Delay para la animación de fadeOut
    setTimeout(() => {
      this.currentImageIndex.set(0);
      this.isClosing.set(false);
      document.body.style.overflow = 'auto';
      this.closeModal.emit();
    }, 300);
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case 'Escape':
        this.onClose();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
    }
  };
}