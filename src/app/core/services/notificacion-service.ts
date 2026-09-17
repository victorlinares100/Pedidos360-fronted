import { Injectable, signal } from '@angular/core';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'exito' | 'alerta' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  notificaciones = signal<Notificacion[]>([]);

  mostrar(mensaje: string, tipo: 'exito' | 'alerta' | 'info' = 'info'): void {
    const id = Date.now();
    const nueva: Notificacion = { id, mensaje, tipo };
    
    this.notificaciones.update(lista => [...lista, nueva]);

    setTimeout(() => {
      this.quitar(id);
    }, 4000);
  }

  quitar(id: number): void {
    this.notificaciones.update(lista => lista.filter(n => n.id !== id));
  }
}