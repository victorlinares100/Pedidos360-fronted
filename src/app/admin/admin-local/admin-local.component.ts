import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../core/models/producto.model';
import { Pedido, EstadoPedido } from '../../core/models/pedido.model';
import { ProductoService } from '../../core/services/producto.service';
import { PedidoService } from '../../core/services/pedido.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-local-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgClass, FormsModule],
  templateUrl: './admin-local.component.html',
  styleUrl: './admin-local.component.css'
})
export class AdminLocalDashboardComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoService = inject(ProductoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tiendaActualId = 1;
  nombreTienda = 'Pan Artesanal';

  tab = signal<'pedidos' | 'productos' | 'ventas'>('pedidos');
  cargando = signal(true);
  pedidos = signal<Pedido[]>([]);
  productos = signal<Producto[]>([]);

  umbralStockCritico = 5;

  pedidosHoy = computed(() => this.pedidos().length);
  
  ingresosHoy = computed(() => 
    this.pedidos()
      .filter(p => p.estado === 'Entregado')
      .reduce((sum, p) => sum + p.total, 0)
  );

  pedidosEntregadosCount = computed(() => 
    this.pedidos().filter(p => p.estado === 'Entregado').length
  );

  productosActivos = computed(() => this.productos().filter(p => p.disponible).length);
  pedidosPendientes = computed(() => this.pedidos().filter(p => p.estado === 'Pendiente').length);

  productosStockBajo = computed(() => 
    this.productos().filter(p => p.stock <= this.umbralStockCritico)
  );

  ngOnInit(): void {
    const usuario = this.authService.usuarioActual();
    if (usuario?.tiendaId) {
      this.tiendaActualId = usuario.tiendaId;
    }

    this.pedidoService.getPedidosPorTienda(this.tiendaActualId).subscribe(data => {
      this.pedidos.set(data);
      this.cargando.set(false);
    });

    this.productoService.getProductosPorTienda(this.tiendaActualId).subscribe(data => {
      this.productos.set(data);
    });
  }

  cambiarTab(tab: 'pedidos' | 'productos' | 'ventas'): void {
    this.tab.set(tab);
  }

  avanzarPedido(pedido: Pedido): void {
    this.pedidoService.avanzarEstado(pedido.id);
  }

  toggleDisponible(producto: Producto): void {
    this.productoService.toggleDisponibilidad(producto.id);
  }

  modificarStock(productoId: number, nuevoStock: number): void {
    if (nuevoStock < 0) return;
    this.productoService.actualizarStock(productoId, nuevoStock);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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