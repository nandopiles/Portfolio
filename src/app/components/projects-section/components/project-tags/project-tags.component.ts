import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-tags',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="project-tags-container">
      <div class="project-tags-row">
        @for (lang of languages; track lang) {
          <span class="project-badge language">
            {{ lang }}
          </span>
        }
        @for (fw of frameworks; track fw) {
          <span class="project-badge framework">
            {{ fw }}
          </span>
        }
        @for (tool of tools; track tool) {
          <span class="project-badge tool">
            {{ tool }}
          </span>
        }
      </div>
    </div>
  `,
    styleUrl: './project-tags.component.scss'
})
export class ProjectTagsComponent {
    @Input() languages: string[] = [];
    @Input() frameworks: string[] = [];
    @Input() tools: string[] = [];
}