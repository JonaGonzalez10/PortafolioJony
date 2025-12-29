import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from './services/contact.service';

type Project = {
  title: string;
  summary: string;
  stack: string[];
  year: string;
  link?: string;
  repo?: string;
  status?: string;
};

type Experience = {
  role: string;
  place: string;
  period: string;
  impact: string;
};

type Certification = {
  name: string;
  issuer: string;
  date: string;
};

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  contactForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  constructor(
    private readonly fb: FormBuilder,
    private readonly contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  readonly hero = {
    name: 'Jonathan González Sánchez',
    role: 'Ingeniero de Pruebas QA & Desarrollador Backend',
    headline: 'Ingeniero en Computación especializado en testing, desarrollo backend con Java/Spring Boot, y soporte a aplicaciones empresariales. Experiencia en metodologías ágiles y bases de datos relacionales.',
    location: 'CDMX, México',
    availability: 'Disponible para nuevos proyectos 2025',
    email: 'jonathan.gonzalez1095@outlook.com',
    whatsapp: '5215512345678' // Reemplaza con tu número real en formato internacional (sin +, espacios ni guiones)
  };

  readonly projects = signal<Project[]>([
    {
      title: 'Sistema de Gestión de Gastos',
      summary:
        'Aplicación web full-stack para control de gastos personales con autenticación JWT, gestión de categorías y reportes. Backend Spring Boot desplegado en Railway con Azure SQL Database.',
      stack: ['Spring Boot', 'Java', 'Azure SQL', 'Angular', 'Railway'],
      year: '2024',
      link: 'https://gestiongastos-production.up.railway.app',
      repo: 'https://github.com/JonaGonzalez10',
      status: 'En producción'
    },
    {
      title: 'Automatización de Reportes Telefónicos',
      summary:
        'Sistema de análisis y reportería en Excel con bases de datos Access para métricas de llamadas. Automatización con VBA para procesar datos de agentes telefónicos y generar estadísticas.',
      stack: ['Excel VBA', 'MS Access', 'SQL'],
      year: '2023',
      status: 'Implementado en SKY'
    },
    {
      title: 'Soporte a Aplicaciones Médicas',
      summary:
        'Configuración y mantenimiento de aplicaciones de laboratorio médico. Gestión de bases de datos SQL Server, configuración de analizadores e interfaces IIS para comunicación entre sistemas.',
      stack: ['SQL Server', 'Windows Services', 'IIS', 'T-SQL'],
      year: '2023',
      status: 'Rochem de México'
    }
  ]);

  readonly skills = signal<string[]>([
    'Java',
    'Spring Boot',
    'SQL Server',
    'Azure',
    'Testing QA',
    'Python',
    'JavaScript',
    'Angular',
    'SQL & T-SQL',
    'Git & GitHub',
    'Scrum',
    'Excel VBA',
    'MS Access',
    'HTML/CSS',
    'IIS',
    'Railway'
  ]);

  readonly featuredSkills = computed(() => this.skills().slice(0, 4));

  readonly experiences = signal<Experience[]>([
    {
      role: 'Ingeniero de Pruebas QA (Tester)',
      place: 'Softtek',
      period: 'Sept 2023 — Actual',
      impact: 'Diseño y ejecución de casos de prueba manuales, detección y documentación de defectos. Colaboración con equipos multidisciplinarios para asegurar entregas de alta calidad bajo SLA.'
    },
    {
      role: 'AMS Support',
      place: 'Softtek',
      period: 'Sept 2023 — Dic 2024',
      impact: 'Soporte técnico en bases de datos relacionales, resolución de incidencias mediante scripts SQL. Cumplimiento de SLA y mejora continua de procesos operativos.'
    },
    {
      role: 'Soporte Técnico a Aplicaciones',
      place: 'Rochem de México',
      period: 'Abril 2023 — Sept 2023',
      impact: 'Soporte a aplicaciones de laboratorio médico (escritorio y web). Configuración de SQL Server, servicios Windows e IIS. Configuración de analizadores e interfaces.'
    },
    {
      role: 'Control de Información',
      place: 'SKY (Servicios Corporativos de Telefonía)',
      period: 'Dic 2022 — Abril 2023',
      impact: 'Creación de reportes en Excel con métricas y estadísticas de llamadas. Diseño de bases de datos en Access, consultas SQL y automatización con Visual Basic.'
    }
  ]);

  readonly certifications = signal<Certification[]>([
    {
      name: 'Oracle Certified Foundations Associate',
      issuer: 'Oracle University',
      date: '2025'
    },
    {
      name: 'Azure Fundamentals AZ-900',
      issuer: 'Microsoft (Inovacción Virtual)',
      date: 'Marzo 2022'
    },
    {
      name: 'Scrum Fundamentals Certified',
      issuer: 'Scrum Study',
      date: 'Marzo 2024'
    },
    {
      name: 'Desarrollador Backend',
      issuer: 'Oracle Next Education',
      date: 'Enero 2024 - Presente'
    },
    {
      name: 'Analista de Datos',
      issuer: 'Google (INROADS)',
      date: 'Enero 2024'
    }
  ]);

  readonly socials = [
    { label: 'GitHub', url: 'https://github.com/JonaGonzalez10' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jonathan-gonzález-sánchez-207388189/' },
    { label: 'Email', url: 'mailto:jonathan.gonzalez1095@outlook.com' }
  ];

  onSubmitContact() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set('');

    this.contactService.sendContactMessage(this.contactForm.value).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.contactForm.reset();
        setTimeout(() => this.submitSuccess.set(false), 5000);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          error.error?.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.'
        );
        setTimeout(() => this.submitError.set(''), 5000);
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field?.touched) return '';

    if (field.hasError('required')) return 'Este campo es requerido';
    if (field.hasError('email')) return 'Email inválido';
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }
}
