import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pedido, EstadoPedido } from '../models/pedido.model';

const FLUJO_ESTADOS: EstadoPedido[] = ['Pendiente', 'En preparación', 'Listo', 'Entregado'];

const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 5001, tiendaId: 1, cliente: 'Camila Rojas',
    items: [{ productoId: 101, nombre: 'Baguette tradicional', cantidad: 2, precioUnitario: 1800 }],
    total: 3600, estado: 'Pendiente', modalidad: 'Retiro en tienda', creadoEn: new Date()
  },
  {
    id: 5002, tiendaId: 1, cliente: 'Matías Soto',
    items: [{ productoId: 102, nombre: 'Pan de masa madre', cantidad: 1, precioUnitario: 3200 }, { productoId: 104, nombre: 'Focaccia romero', cantidad: 1, precioUnitario: 4500 }],
    total: 7700, estado: 'En preparación', modalidad: 'Entrega a domicilio', creadoEn: new Date()
  },
  {
    id: 5003, tiendaId: 1, cliente: 'Javiera Muñoz',
    items: [{ productoId: 101, nombre: 'Baguette tradicional', cantidad: 3, precioUnitario: 1800 }],
    total: 5400, estado: 'Listo', modalidad: 'Retiro en tienda', creadoEn: new Date()
  },
  {
    id: 5004, tiendaId: 1, cliente: 'Diego Fuentes',
    items: [{ productoId: 104, nombre: 'Focaccia romero', cantidad: 2, precioUnitario: 4500 }],
    total: 9000, estado: 'Entregado', modalidad: 'Entrega a domicilio', creadoEn: new Date()
  },
];

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private pedidos: Pedido[] = PEDIDOS_MOCK;

  // 👇 Cuando exista la API, reemplazar por HttpClient manteniendo la firma
  getPedidosPorTienda(tiendaId: number): Observable<Pedido[]> {
    return of(this.pedidos.filter(p => p.tiendaId === tiendaId)).pipe(delay(300));
  }

  avanzarEstado(pedidoId: number): Pedido | undefined {
    const pedido = this.pedidos.find(p => p.id === pedidoId);
    if (!pedido) return undefined;
    const idx = FLUJO_ESTADOS.indexOf(pedido.estado);
    if (idx > -1 && idx < FLUJO_ESTADOS.length - 1) {
      pedido.estado = FLUJO_ESTADOS[idx + 1];
    }
    return pedido;
  }
}