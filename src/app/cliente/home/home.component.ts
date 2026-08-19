import { Component } from '@angular/core';

interface Tienda {
  id: number;
  nombre: string;
  categoria: 'Panadería' | 'Pastelería' | 'Cafetería';
  especialidad: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  iconos: Record<string, string> = {
    Panadería: '🥐',
    Pastelería: '🎂',
    Cafetería: '☕'
  };

  tiendas: Tienda[] = [
    { id: 1, nombre: 'Pan Artesanal', categoria: 'Panadería', especialidad: 'Masa madre de fermentación lenta' },
    { id: 2, nombre: 'Café Central', categoria: 'Cafetería', especialidad: 'Grano de origen, tostado propio' },
    { id: 3, nombre: 'Dulce Rincón', categoria: 'Pastelería', especialidad: 'Tortas por encargo' },
    { id: 4, nombre: 'Horno Real', categoria: 'Panadería', especialidad: 'Pan de campo y baguettes' }
  ];

  verProductos(tienda: Tienda): void {
    console.log('Ver productos de:', tienda.nombre);
    // Próximo paso: navegar a /tiendas/:id usando el Router de Angular
  }
}
