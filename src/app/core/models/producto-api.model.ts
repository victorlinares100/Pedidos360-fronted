export interface TiendaBackend {
  idTienda: number;
  nombre: string;
}

export interface ProductoBackend {
  idProducto: number;
  tienda: TiendaBackend;
  nombre: string;
  tipo: string;
  marca: string;
  precio: number;
}