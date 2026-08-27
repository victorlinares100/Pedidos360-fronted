import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TiendaApiService } from '../../core/services/tienda-api.service';
import { ProductoApiService } from '../../core/services/producto-api.service';
import { TiendaBackend } from '../../core/models/tienda-api.model';
import { ProductoBackend } from '../../core/models/producto-api.model';

@Component({
  selector: 'app-tienda-detalle',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './tienda-detalle.component.html',
  styleUrl: './tienda-detalle.component.css'
})
export class TiendaDetalleComponent implements OnInit {
  cargando = signal(true);
  tienda = signal<TiendaBackend | null>(null);
  productosDeTienda = signal<ProductoBackend[]>([]);

  totalProductos = computed(() => this.productosDeTienda().length);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tiendaApiService: TiendaApiService,
    private productoApiService: ProductoApiService
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  this.tiendaApiService.getTiendaPorId(id).subscribe({
    next: (data) => {
      console.log('🏪 [TIENDA]', data);
      this.tienda.set(data);
    },
    error: (err) => console.error('❌ [TIENDA]', err)
  });

  // Nota: el backend aún no filtra por tienda en el endpoint,
  // así que traemos todos los productos y filtramos acá.
  // Cuando el equipo agregue GET /productos/tienda/{id}, se cambia
  // esta línea por productoApiService.getProductosPorTienda(id).
  this.productoApiService.getProductos().subscribe(productos => {
    this.productosDeTienda.set((productos ?? []).filter(p => p.tienda?.idTienda === id));
    this.cargando.set(false);
  });
}

  volver(): void {
    this.router.navigate(['/']);
  }

  
}