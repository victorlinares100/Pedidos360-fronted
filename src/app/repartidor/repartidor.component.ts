import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../core/services/pedido.service';
import { AuthService } from '../core/services/auth.service';
import { Pedido } from '../core/models/pedido.model';

@Component({
  selector: 'app-repartidor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repartidor.component.html',
  styleUrl: './repartidor.component.css'
})
export class RepartidorComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  pedidos: Pedido[] = [];
  cargando = true;

  get porEntregarCount(): number {
    return this.pedidos.filter(p => p.estado === 'Listo').length;
  }

  get entregadosCount(): number {
    return this.pedidos.filter(p => p.estado === 'Entregado').length;
  }

  ngOnInit(): void {
    this.cargarDespachos();
  }

  cargarDespachos(): void {
    const usuario = this.authService.usuarioActual();
    const tiendaId = usuario?.tiendaId ?? 1;

    this.pedidoService.getPedidosPorTienda(tiendaId).subscribe({
      next: (data) => {
        // En repartidor filtramos solo despachos a domicilio que estén Listos o Entregados
        this.pedidos = data.filter(
          p => p.modalidad === 'Entrega a domicilio' && (p.estado === 'Listo' || p.estado === 'Entregado')
        );
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  marcarEntregado(pedidoId: number): void {
    const pedidoActualizado = this.pedidoService.avanzarEstado(pedidoId);
    if (pedidoActualizado) {
      this.cargarDespachos();
    }
  }

  obtenerMinutosTranscurridos(fecha: Date): number {
    const inicio = new Date(fecha).getTime();
    const ahora = new Date().getTime();
    return Math.max(0, Math.floor((ahora - inicio) / 60000));
  }
}