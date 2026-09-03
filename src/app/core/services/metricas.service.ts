import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MetricaTienda, ProductoTop } from '../models/metrica.model';

const METRICAS_MOCK: MetricaTienda[] = [
  { tiendaId: 1, nombre: 'Pan Artesanal', categoria: 'Panadería', ventasHoy: 187500, pedidosHoy: 34, ticketPromedio: 5514 },
  { tiendaId: 2, nombre: 'Café Central', categoria: 'Cafetería', ventasHoy: 214300, pedidosHoy: 58, ticketPromedio: 3695 },
  { tiendaId: 3, nombre: 'Dulce Rincón', categoria: 'Pastelería', ventasHoy: 96200, pedidosHoy: 12, ticketPromedio: 8017 },
  { tiendaId: 4, nombre: 'Horno Real', categoria: 'Panadería', ventasHoy: 54800, pedidosHoy: 19, ticketPromedio: 2884 },
  { tiendaId: 5, nombre: 'Espresso Lab', categoria: 'Cafetería', ventasHoy: 168900, pedidosHoy: 47, ticketPromedio: 3594 },
  { tiendaId: 6, nombre: 'La Marquesa', categoria: 'Pastelería', ventasHoy: 72100, pedidosHoy: 9, ticketPromedio: 8011 },
  { tiendaId: 7, nombre: 'Trigo Dorado', categoria: 'Panadería', ventasHoy: 41300, pedidosHoy: 15, ticketPromedio: 2753 },
  { tiendaId: 8, nombre: 'Grano y Aroma', categoria: 'Cafetería', ventasHoy: 129700, pedidosHoy: 36, ticketPromedio: 3603 },
];

const PRODUCTOS_TOP_MOCK: ProductoTop[] = [
  { nombre: 'Latte', tiendaNombre: 'Espresso Lab', cantidadVendida: 142 },
  { nombre: 'Croissant mantequilla', tiendaNombre: 'Pan Artesanal', cantidadVendida: 118 },
  { nombre: 'Café americano', tiendaNombre: 'Café Central', cantidadVendida: 97 },
  { nombre: 'Cheesecake individual', tiendaNombre: 'Dulce Rincón', cantidadVendida: 64 },
  { nombre: 'Baguette tradicional', tiendaNombre: 'Pan Artesanal', cantidadVendida: 58 },
];

@Injectable({ providedIn: 'root' })
export class MetricasService {
  // 👇 Cuando existan los datos reales, esto se arma combinando
  // GET /api/pedidos (agrupado por tienda) + GET /api/tiendas del backend,
  // manteniendo la misma firma Observable<MetricaTienda[]>.
  getMetricasPorTienda(): Observable<MetricaTienda[]> {
    return of(METRICAS_MOCK).pipe(delay(400));
  }

  getProductosTop(): Observable<ProductoTop[]> {
    return of(PRODUCTOS_TOP_MOCK).pipe(delay(400));
  }
}