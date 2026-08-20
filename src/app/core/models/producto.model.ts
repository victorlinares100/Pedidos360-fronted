export interface Producto {
  id: number;
  tiendaId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  disponible: boolean;
}