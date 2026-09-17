import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto.model';
import { ItemPedido } from '../models/pedido.model';

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
    stock: 3, 
    disponible: true,
    imagenUrl: 'https://images.unsplash.com/photo-1579697096985-41fe1430e5df?w=500&q=80'
  },
];

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private productosSubject = new BehaviorSubject<Producto[]>(PRODUCTOS_MOCK);
  public productos$ = this.productosSubject.asObservable();

  getProductosPorTienda(tiendaId: number): Observable<Producto[]> {
    return this.productos$.pipe(
      map(productos => productos.filter(p => p.tiendaId === tiendaId))
    );
  }

  toggleDisponibilidad(productoId: number): Producto | undefined {
    const listaActual = this.productosSubject.getValue();
    const idx = listaActual.findIndex(p => p.id === productoId);
    if (idx === -1) return undefined;

    const listaActualizada = [...listaActual];
    const productoActual = { ...listaActualizada[idx] };
    productoActual.disponible = !productoActual.disponible;
    listaActualizada[idx] = productoActual;

    this.productosSubject.next(listaActualizada);
    return productoActual;
  }

  actualizarStock(productoId: number, nuevoStock: number): Producto | undefined {
    const listaActual = this.productosSubject.getValue();
    const idx = listaActual.findIndex(p => p.id === productoId);
    if (idx === -1) return undefined;

    const listaActualizada = [...listaActual];
    const productoActual = { ...listaActualizada[idx] };
    
    productoActual.stock = Math.max(0, nuevoStock);
    productoActual.disponible = productoActual.stock > 0;

    listaActualizada[idx] = productoActual;
    this.productosSubject.next(listaActualizada);
    return productoActual;
  }

  descontarStock(items: ItemPedido[]): void {
    const listaActual = this.productosSubject.getValue();
    
    const listaActualizada = listaActual.map(prod => {
      const itemComprado = items.find(item => item.productoId === prod.id);
      if (itemComprado) {
        const nuevoStock = Math.max(0, prod.stock - itemComprado.cantidad);
        return {
          ...prod,
          stock: nuevoStock,
          disponible: nuevoStock > 0
        };
      }
      return prod;
    });

    this.productosSubject.next(listaActualizada);
  }

  getAlertasStock(tiendaId: number, umbralCritico: number = 5): Observable<Producto[]> {
    return this.getProductosPorTienda(tiendaId).pipe(
      map(productos => productos.filter(p => p.stock <= umbralCritico))
    );
  }
}