export type CategoriaTienda = 'Panadería' | 'Pastelería' | 'Cafetería';

export interface Tienda {
  id: number;
  nombre: string;
  categoria: CategoriaTienda;
  especialidad: string;
  logoUrl?: string;
  calificacion?: number;      // 1-5
  tiempoEstimado?: string;    // "15-25 min"
  activa: boolean;            // abierta / cerrada
  destacada?: boolean;        // aparece en la fila de "Ofertas destacadas"
  descuento?: string;         // "15% dcto", "2x1", "Envío gratis"
}