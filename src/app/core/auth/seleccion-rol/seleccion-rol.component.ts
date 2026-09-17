import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion-rol',
  standalone: true,
  templateUrl: './seleccion-rol.component.html',
  styleUrl: './seleccion-rol.component.css'
})
export class SeleccionRolComponent {
  private router = inject(Router);

  // Los roles que vienen del token de Azure
  roles = signal<string[]>([]);

  // Nombres bonitos para mostrar en pantalla
  etiquetas: Record<string, string> = {
    admin_general: 'Administración General',
    admin_local: 'Administración de Tienda',
    cocina: 'Cocina',
    repartidor: 'Repartidor',
    cliente: 'Cliente'
  };

  rutas: Record<string, string> = {
    admin_general: '/admin-general',
    admin_local: '/admin-local',
    cocina: '/cocina',
    repartidor: '/repartidor',
    cliente: '/'
  };

  entrarComo(rol: string): void {
    // Aquí después actualizamos el rol activo en AuthService
    this.router.navigate([this.rutas[rol] ?? '/']);
  }
}