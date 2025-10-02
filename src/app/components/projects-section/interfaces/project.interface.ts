export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    galleryImages?: string[];
    technologies: {
        languages: string[];
        frameworks: string[];
        tools: string[];
    };
    liveUrl?: string;
    githubUrl?: string;
}

export interface FilterCategory {
    name: string;
    key: keyof Project['technologies'];
    items: string[];
}

export interface ActiveFilters {
    languages: string[];
    frameworks: string[];
    tools: string[];
}