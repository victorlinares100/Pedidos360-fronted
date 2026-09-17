import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../core/services/pedido.service';
import { AuthService } from '../../../core/services/auth.service';
import { Pedido, EstadoPedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-pedidos.component.html',
  styleUrl: './mis-pedidos.component.css'
})
export class MisPedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private authService = inject(AuthService);

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);

  pedidosActivos = computed(() => 
    this.pedidos().filter(p => p.estado !== 'Entregado' && p.estado !== 'Cancelado')
  );

  historialPedidos = computed(() => 
    this.pedidos().filter(p => p.estado === 'Entregado' || p.estado === 'Cancelado')
  );

  ngOnInit(): void {
    const usuario = this.authService.usuarioActual();
    const nombreCliente = usuario?.nombre || 'Camila Rojas';

    this.pedidoService.getPedidosPorCliente(nombreCliente).subscribe(data => {
      this.pedidos.set(data);
      this.cargando.set(false);
    });
  }

  obtenerPasoEstado(estado: EstadoPedido): number {
    const pasos: Record<EstadoPedido, number> = {
      'Pendiente': 1,
      'En preparación': 2,
      'Listo': 3,
      'Entregado': 4,
      'Cancelado': 0
    };
    return pasos[estado] ?? 1;
  }
}