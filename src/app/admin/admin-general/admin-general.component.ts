import { Component, OnInit, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MetricaTienda, ProductoTop } from '../../core/models/metrica.model';
import { MetricasService } from '../../core/services/metricas.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-general',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './admin-general.component.html',
  styleUrl: './admin-general.component.css'
})
export class AdminGeneralComponent implements OnInit {
  cargando = signal(true);
  metricas = signal<MetricaTienda[]>([]);
  productosTop = signal<ProductoTop[]>([]);

  totalVentas = computed(() =>
    this.metricas().reduce((sum, m) => sum + m.ventasHoy, 0)
  );

  totalPedidos = computed(() =>
    this.metricas().reduce((sum, m) => sum + m.pedidosHoy, 0)
  );

  ticketPromedioGeneral = computed(() => {
    const pedidos = this.totalPedidos();
    return pedidos === 0 ? 0 : Math.round(this.totalVentas() / pedidos);
  });

  tiendasOrdenadas = computed(() =>
    [...this.metricas()].sort((a, b) => b.ventasHoy - a.ventasHoy)
  );

  ventaMaxima = computed(() =>
    Math.max(...this.metricas().map(m => m.ventasHoy), 1)
  );

  constructor(
    private metricasService: MetricasService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.metricasService.getMetricasPorTienda().subscribe(data => {
      this.metricas.set(data);
      this.cargando.set(false);
    });

    this.metricasService.getProductosTop().subscribe(data => {
      this.productosTop.set(data);
    });
  }

  porcentajeBarra(ventas: number): number {
    return (ventas / this.ventaMaxima()) * 100;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}