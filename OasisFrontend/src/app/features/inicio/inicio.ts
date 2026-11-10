import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AvisoService } from '../comunicacion/aviso/aviso-service';
import { Aviso } from '../comunicacion/aviso/aviso.model';
import { HabitacionService } from '../alojamiento/habitacion/habitacion-service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly avisoService = inject(AvisoService);
  private readonly habitacionService = inject(HabitacionService);
  readonly authService = inject(AuthService);

  readonly requireAuthNotice = signal<boolean>(false);
  readonly noticias = signal<Aviso[]>([]);
  readonly totalHabitaciones = signal<number>(24);
  readonly loading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.requireAuthNotice.set(params['authRequired'] === 'true');
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);

    this.avisoService.listar().subscribe({
      next: (data) => {
        this.noticias.set(data.slice(0, 4));
        this.loading.set(false);
      },
      error: () => {
        // Fallback seed notices if server responds with empty or error
        this.noticias.set([
          {
            id: 1,
            titulo: 'Reglamento Interno y Convivencia Semestre 2026-I',
            contenido: 'Recordamos a todos los residentes los horarios de silencio a partir de las 22:00 hrs y el correcto uso de áreas comunes.',
            categoria: 'NORMA',
            fechaPublicacion: '2026-01-10',
            fijado: true,
            activo: true,
          },
          {
            id: 2,
            titulo: 'Cocina Grupal de Fin de Mes',
            contenido: 'Invitamos a todos los residentes a nuestra cocina grupal este sábado en la terraza. ¡Trae tus mejores recetas!',
            categoria: 'EVENTO',
            fechaPublicacion: '2026-02-25',
            fijado: true,
            activo: true,
          },
          {
            id: 3,
            titulo: 'Noche de Películas y Pizza en la Sala Común',
            contenido: 'Este viernes nos reuniremos en la sala de estudio audiovisual para maratón de cine universitario con pizzas patrocinadas.',
            categoria: 'CINE',
            fechaPublicacion: '2026-04-15',
            fijado: false,
            activo: true,
          },
        ]);
        this.loading.set(false);
      },
    });

    this.habitacionService.listar().subscribe({
      next: (habs) => {
        if (habs && habs.length > 0) {
          this.totalHabitaciones.set(habs.length);
        }
      },
      error: () => {},
    });
  }
}
