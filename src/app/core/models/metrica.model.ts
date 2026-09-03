export interface MetricaTienda {
  tiendaId: number;
  nombre: string;
  categoria: 'Panadería' | 'Pastelería' | 'Cafetería';
  ventasHoy: number;
  pedidosHoy: number;
  ticketPromedio: number;
}

export interface ProductoTop {
  nombre: string;
  tiendaNombre: string;
  cantidadVendida: number;
}