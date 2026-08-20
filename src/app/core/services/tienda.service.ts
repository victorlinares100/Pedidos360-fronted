import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tienda } from '../models/tienda.model';

const TIENDAS_MOCK: Tienda[] = [
  { id: 1, nombre: 'Pan Artesanal', categoria: 'Panadería', especialidad: 'Masa madre de fermentación lenta', calificacion: 4.8, tiempoEstimado: '15-25 min', activa: true, destacada: true, descuento: '15% dcto' },
  { id: 2, nombre: 'Café Central', categoria: 'Cafetería', especialidad: 'Grano de origen, tostado propio', calificacion: 4.6, tiempoEstimado: '10-20 min', activa: true },
  { id: 3, nombre: 'Dulce Rincón', categoria: 'Pastelería', especialidad: 'Tortas por encargo', calificacion: 4.9, tiempoEstimado: '30-40 min', activa: true, destacada: true, descuento: '2x1 en postres' },
  { id: 4, nombre: 'Horno Real', categoria: 'Panadería', especialidad: 'Pan de campo y baguettes', calificacion: 4.5, tiempoEstimado: '20-30 min', activa: false },
  { id: 5, nombre: 'Espresso Lab', categoria: 'Cafetería', especialidad: 'Métodos filtrados y cold brew', calificacion: 4.7, tiempoEstimado: '10-15 min', activa: true, destacada: true, descuento: 'Envío gratis' },
  { id: 6, nombre: 'La Marquesa', categoria: 'Pastelería', especialidad: 'Repostería francesa', calificacion: 4.4, tiempoEstimado: '25-35 min', activa: true },
];

@Injectable({ providedIn: 'root' })
export class TiendaService {
  private tiendas: Tienda[] = TIENDAS_MOCK;

  // 👇 Cuando la API esté lista, cambiar el cuerpo por HttpClient
  // manteniendo la misma firma (Observable<Tienda[]>). Ej:
  // return this.http.get<Tienda[]>(`${environment.apiUrl}/tiendas`);
  getTiendas(): Observable<Tienda[]> {
    return of(this.tiendas).pipe(delay(400));
  }

  getTiendaPorId(id: number): Observable<Tienda | undefined> {
    return of(this.tiendas.find(t => t.id === id)).pipe(delay(300));
  }
}