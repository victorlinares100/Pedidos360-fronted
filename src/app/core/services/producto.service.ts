import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Producto } from '../models/producto.model';

const PRODUCTOS_MOCK: Producto[] = [
  { 
    id: 101, 
    tiendaId: 1, 
    nombre: 'Baguette tradicional', 
    descripcion: 'Pan francés crocante', 
    precio: 1800, 
    stock: 24, 
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80'
  },
  { 
    id: 102, 
    tiendaId: 1, 
    nombre: 'Pan de masa madre', 
    descripcion: 'Fermentación de 24h', 
    precio: 3200, 
    stock: 12, 
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&q=80'
  },
  { 
    id: 103, 
    tiendaId: 1, 
    nombre: 'Croissant mantequilla', 
    descripcion: 'Hojaldre artesanal', 
    precio: 1500, 
    stock: 0, 
    disponible: false,
    imagenUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&q=80'
  },
  { 
    id: 104, 
    tiendaId: 1, 
    nombre: 'Focaccia romero', 
    descripcion: 'Con aceite de oliva', 
    precio: 4500, 
    stock: 8, 
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=500&q=80'
  },
];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private productos: Producto[] = PRODUCTOS_MOCK;

  // 👇 Cuando exista la API, reemplazar por HttpClient manteniendo la firma
  getProductosPorTienda(tiendaId: number): Observable<Producto[]> {
    return of(this.productos.filter(p => p.tiendaId === tiendaId)).pipe(delay(300));
  }

  toggleDisponibilidad(productoId: number): Producto | undefined {
    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) return undefined;
    producto.disponible = !producto.disponible;
    return producto;
  }
}