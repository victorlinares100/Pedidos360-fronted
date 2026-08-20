import { Component, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { Producto } from '../../core/models/producto.model';
import { Pedido, EstadoPedido } from '../../core/models/pedido.model';
import { ProductoService } from '../../core/services/producto.service';
import { PedidoService } from '../../core/services/pedido.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-local-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './admin-local.component.html',
  styleUrl: './admin-local.component.css'
})
export class AdminLocalDashboardComponent implements OnInit {
  // TODO: reemplazar por el tiendaId del usuario autenticado cuando exista el login
  tiendaActualId = 1;
  nombreTienda = 'Pan Artesanal';

  tab = signal<'pedidos' | 'productos'>('pedidos');
  cargando = signal(true);
  pedidos = signal<Pedido[]>([]);
  productos = signal<Producto[]>([]);

  pedidosHoy = computed(() => this.pedidos().length);
  ingresosHoy = computed(() => this.pedidos().reduce((sum, p) => sum + p.total, 0));
  productosActivos = computed(() => this.productos().filter(p => p.disponible).length);
  pedidosPendientes = computed(() => this.pedidos().filter(p => p.estado === 'Pendiente').length);

  constructor(
    private pedidoService: PedidoService,
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion(): void {
  this.authService.logout();
  this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.pedidoService.getPedidosPorTienda(this.tiendaActualId).subscribe(data => {
      this.pedidos.set(data);
      this.cargando.set(false);
    });

    this.productoService.getProductosPorTienda(this.tiendaActualId).subscribe(data => {
      this.productos.set(data);
    });
  }

  cambiarTab(tab: 'pedidos' | 'productos'): void {
    this.tab.set(tab);
  }

  avanzarPedido(pedido: Pedido): void {
    const actualizado = this.pedidoService.avanzarEstado(pedido.id);
    if (!actualizado) return;
    this.pedidos.update(lista => lista.map(p => (p.id === actualizado.id ? { ...actualizado } : p)));
  }

  toggleDisponible(producto: Producto): void {
    const actualizado = this.productoService.toggleDisponibilidad(producto.id);
    if (!actualizado) return;
    this.productos.update(lista => lista.map(p => (p.id === actualizado.id ? { ...actualizado } : p)));
  }

  siguienteAccion(estado: EstadoPedido): string | null {
    const acciones: Record<EstadoPedido, string | null> = {
      'Pendiente': 'Aceptar y preparar',
      'En preparación': 'Marcar como listo',
      'Listo': 'Marcar entregado',
      'Entregado': null,
      'Cancelado': null
    };
    return acciones[estado];
  }

  claseEstado(estado: EstadoPedido): string {
    const clases: Record<EstadoPedido, string> = {
      'Pendiente': 'estado-pendiente',
      'En preparación': 'estado-preparacion',
      'Listo': 'estado-listo',
      'Entregado': 'estado-entregado',
      'Cancelado': 'estado-cancelado'
    };
    return clases[estado];
  }
}