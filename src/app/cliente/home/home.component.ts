import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Tienda, CategoriaTienda } from '../../core/models/tienda.model';
import { TiendaService } from '../../core/services/tienda.service';
import { PedidoApiService } from '../../core/services/pedido-api.service';
import { RouterLink } from '@angular/router';

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

  categorias: (CategoriaTienda | 'Todas')[] = ['Todas', 'Panadería', 'Pastelería', 'Cafetería'];

  cargando = signal(true);
  tiendas = signal<Tienda[]>([]);
  categoriaSeleccionada = signal<CategoriaTienda | 'Todas'>('Todas');
  busqueda = signal('');

  tiendasFiltradas = computed(() => {
    const cat = this.categoriaSeleccionada();
    const term = this.busqueda().trim().toLowerCase();

    return this.tiendas().filter(t => {
      const coincideCategoria = cat === 'Todas' || t.categoria === cat;
      const coincideBusqueda = !term ||
        t.nombre.toLowerCase().includes(term) ||
        t.especialidad.toLowerCase().includes(term);
      return coincideCategoria && coincideBusqueda;
    });
  });

  tiendasDestacadas = computed(() =>
    this.tiendas().filter(t => t.destacada && t.activa)
  );

  constructor(private tiendaService: TiendaService, private router: Router, private pedidoApiService: PedidoApiService) {}

  ngOnInit(): void {
    this.tiendaService.getTiendas().subscribe(data => {
      this.tiendas.set(data);
      this.cargando.set(false);
    });

    this.pedidoApiService.getPedidos().subscribe({
      next: (data) => console.log('✅ Conectado al backend:', data),
      error: (err) => console.error('❌ Error de conexión:', err)
    });
  
  }

  
  seleccionarCategoria(cat: CategoriaTienda | 'Todas'): void {
    this.categoriaSeleccionada.set(cat);
  }

  onBuscar(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  fondoCategoria(cat: CategoriaTienda): string {
    return this.gradientes[cat];
  }

  verProductos(tienda: Tienda): void {
    this.router.navigate(['/tienda', tienda.id]);
  }

  
}