import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Tienda, CategoriaTienda } from '../../core/models/tienda.model';
import { TiendaService } from '../../core/services/tienda.service';
import { PedidoApiService } from '../../core/services/pedido-api.service';
import { ProductoApiService } from '../../core/services/producto-api.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  iconos: Record<CategoriaTienda, string> = {
    Panadería: '🥐',
    Pastelería: '🎂',
    Cafetería: '☕'
  };

  gradientes: Record<CategoriaTienda, string> = {
    Panadería: 'linear-gradient(135deg, #FFD59E, #FF6B2C)',
    Pastelería: 'linear-gradient(135deg, #FFB199, #E8491D)',
    Cafetería: 'linear-gradient(135deg, #C89666, #7A4A2B)'
  };

  // Banco de imágenes variadas para que cada tienda tenga su propia foto
  imagenesVariadas: string[] = [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80'
  ];

  categorias: (CategoriaTienda | 'Todas')[] = ['Todas', 'Panadería', 'Pastelería', 'Cafetería'];

  cargando = signal(true);
  tiendas = signal<Tienda[]>([]);
  categoriaSeleccionada = signal<CategoriaTienda | 'Todas'>('Todas');
  busqueda = signal('');

  tiendasFiltradas = computed(() => {
    const cat = this.categoriaSeleccionada();
    const term = this.busqueda().trim().toLowerCase();

    return this.tiendas().filter(t => {
      const nombre = this.getNombre(t).toLowerCase();
      const especialidad = this.getEspecialidad(t).toLowerCase();
      const categoria = this.getCategoria(t);

      const coincideCategoria = cat === 'Todas' || categoria === cat;
      const coincideBusqueda = !term || nombre.includes(term) || especialidad.includes(term);

      return coincideCategoria && coincideBusqueda;
    });
  });

  tiendasDestacadas = computed(() =>
    this.tiendas().filter(t => t.destacada && t.activa)
  );

  constructor(private tiendaService: TiendaService, private router: Router, private pedidoApiService: PedidoApiService,  private productoApiService: ProductoApiService) {}

  ngOnInit(): void {
    this.tiendaService.getTiendas().subscribe(data => {
      // Inyecta imágenes variadas y asegura compatibilidad de campos
      const tiendasProcesadas = data.map((tienda, idx) => ({
        ...tienda,
        logoUrl: tienda.logoUrl || (tienda as any).imagenUrl || this.imagenesVariadas[idx % this.imagenesVariadas.length]
      }));

      this.tiendas.set(tiendasProcesadas);
      this.cargando.set(false);
    });

    this.pedidoApiService.getPedidos().subscribe({
    next: (data) => console.log('✅ [PEDIDOS - puerto 8082]', data),
    error: (err) => console.error('❌ [PEDIDOS - puerto 8082]', err)
  });

  this.productoApiService.getProductos().subscribe({
    next: (data) => console.log('✅ [INVENTARIO - puerto 8081]', data),
    error: (err) => console.error('❌ [INVENTARIO - puerto 8081]', err)
  });
  
  }

  // Helpers para garantizar que el texto se muestre sin importar el nombre de propiedad
  getNombre(t: any): string {
    return t.nombre || t.nombreTienda || 'Tienda';
  }

  getCategoria(t: any): CategoriaTienda {
    return (t.categoria || t.categoriaTienda || 'Panadería') as CategoriaTienda;
  }

  getEspecialidad(t: any): string {
    return t.especialidad || t.descripcion || 'Productos frescos en tu campus';
  }

  getTiempo(t: any): string {
    return t.tiempoEstimado || t.tiempoEntrega || '15-20 min';
  }

  getId(t: any): number {
    return t.id ?? t.idTienda ?? 0;
  }

  seleccionarCategoria(cat: CategoriaTienda | 'Todas'): void {
    this.categoriaSeleccionada.set(cat);
  }

  onBuscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  fondoCategoria(cat: CategoriaTienda): string {
    return this.gradientes[cat] || 'linear-gradient(135deg, #FFD59E, #FF6B2C)';
  }

  verProductos(tienda: any): void {
    this.router.navigate(['/tienda', this.getId(tienda)]);
  }
}