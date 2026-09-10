import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../core/services/pedido.service';
import { AuthService } from '../core/services/auth.service';
import { Pedido } from '../core/models/pedido.model';

@Component({
  selector: 'app-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cocina.component.html',
  styleUrl: './cocina.component.css'
})
export class CocinaComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  pedidos: Pedido[] = [];
  cargando = true;

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    const usuario = this.authService.usuarioActual();
    const tiendaId = usuario?.tiendaId ?? 1;

    this.pedidoService.getPedidosPorTienda(tiendaId).subscribe({
      next: (data) => {
        // En cocina solo se muestran los pedidos activos que requieren atención
        this.pedidos = data.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación');
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  cambiarEstado(pedidoId: number): void {
    const pedidoActualizado = this.pedidoService.avanzarEstado(pedidoId);
    if (pedidoActualizado) {
      this.cargarPedidos();
    }
  }

  obtenerMinutosTranscurridos(fecha: Date): number {
    const inicio = new Date(fecha).getTime();
    const ahora = new Date().getTime();
    return Math.max(0, Math.floor((ahora - inicio) / 60000));
  }
}