export interface PedidoBackend {
  idPedido: number;
  direccion: string;
  productos: number[]; // IDs de producto — todavía sin cantidad por producto
}