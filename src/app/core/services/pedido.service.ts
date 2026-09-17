import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
  private pedidosSubject = new BehaviorSubject<Pedido[]>(PEDIDOS_MOCK);
  public pedidos$ = this.pedidosSubject.asObservable();

  getPedidosPorTienda(tiendaId: number): Observable<Pedido[]> {
    return this.pedidos$.pipe(
      map(pedidos => pedidos.filter(p => p.tiendaId === tiendaId))
    );
  }

  crearPedido(nuevoPedidoData: Omit<Pedido, 'id' | 'estado' | 'creadoEn'>): Pedido {
    const listaActual = this.pedidosSubject.getValue();
    const nuevoId = Math.max(...listaActual.map(p => p.id), 5000) + 1;

    const nuevoPedido: Pedido = {
      ...nuevoPedidoData,
      id: nuevoId,
      estado: 'Pendiente',
      creadoEn: new Date()
    };

    this.pedidosSubject.next([nuevoPedido, ...listaActual]);
    return nuevoPedido;
  }

  getPedidosPorCliente(nombreCliente: string): Observable<Pedido[]> {
    return this.pedidos$.pipe(
      map(pedidos => pedidos.filter(p => p.cliente.toLowerCase() === nombreCliente.toLowerCase()))
    );
  }

  getPedidoPorId(id: number): Observable<Pedido | undefined> {
    return this.pedidos$.pipe(
      map(pedidos => pedidos.find(p => p.id === id))
    );
  }

  avanzarEstado(pedidoId: number): Pedido | undefined {
    const listaActual = this.pedidosSubject.getValue();
    const idx = listaActual.findIndex(p => p.id === pedidoId);

    if (idx === -1) return undefined;

    const pedido = { ...listaActual[idx] };
    const estadoIdx = FLUJO_ESTADOS.indexOf(pedido.estado);

    if (estadoIdx > -1 && estadoIdx < FLUJO_ESTADOS.length - 1) {
      pedido.estado = FLUJO_ESTADOS[estadoIdx + 1];
      const listaActualizada = [...listaActual];
      listaActualizada[idx] = pedido;
      this.pedidosSubject.next(listaActualizada);
    }

    return pedido;
  }

  getHistorialPedidos(tiendaId: number): Observable<Pedido[]> {
    return this.pedidos$.pipe(
      map(pedidos => pedidos.filter(p => p.tiendaId === tiendaId && p.estado === 'Entregado'))
    );
  }

  getMetricasVentas(tiendaId: number): Observable<{ totalVentas: number; totalPedidos: number; promedioTicket: number }> {
    return this.getPedidosPorTienda(tiendaId).pipe(
      map(pedidos => {
        const entregados = pedidos.filter(p => p.estado === 'Entregado');
        const totalVentas = entregados.reduce((sum, p) => sum + p.total, 0);
        const totalPedidos = entregados.length;
        const promedioTicket = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

        return { totalVentas, totalPedidos, promedioTicket };
      })
    );
  }
}