import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
    period: string;
    title: string;
    company: string;
    description: string;
    tech: string[];
}

@Component({
    selector: 'app-experience-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './experience-section.component.html',
    styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent implements OnInit {
    @ViewChild('sectionRef', { static: true }) sectionRef!: ElementRef;
    protected experiences = signal<Experience[]>([
        {
            period: 'Sept 2024 — Presente',
            title: 'Frontend Developer',
            company: 'Conmuta Soluciones',
            description:
                'Lideré el desarrollo de un e-commerce personalizable para cada cliente con Angular 19, gestionando tareas en Jira y asegurando la calidad del proyecto. Además, colaboré en una plataforma de centralización de desguaces en España, trabajando en los módulos de pedidos, facturación con Holded, clientes y en la definición de reglas avanzadas de precios.',
            tech: ['Angular 19', 'TypeScript', 'SCSS', 'Bootstrap', 'REST APIs', 'GitLab', 'Jira', 'Jenkins'],
        },
        {
            period: 'Jan 2024 — Jul 2024',
            title: 'Frontend Developer',
            company: 'Onestic',
            description:
                'Desarrollé aplicaciones internas con Angular para la gestión de reservas y promociones. Creé componentes reutilizables que mejoraron la usabilidad y añadí un sistema de notificaciones automáticas conectado a API y base de datos, incrementando la participación de los usuarios.',
            tech: ['Angular', 'TypeScript', 'Bootstrap', 'GitHub', 'REST APIs'],
        },
        {
            period: 'Mar 2023 — Jun 2023',
            title: 'Backend Developer',
            company: 'Lãberit',
            description:
                'Diseñé microservicios en .NET para integrar y procesar datos entre sistemas. También personalicé soluciones en Microsoft Dynamics 365, optimizando la gestión empresarial y la eficiencia de los procesos internos.',
            tech: ['.NET', 'Microservicios', 'Microsoft Dynamics 365', 'Git', 'GitHub'],
        },
    ]);

    protected isVisible = signal<boolean>(false);

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
