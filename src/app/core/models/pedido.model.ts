export type EstadoPedido = 'Pendiente' | 'En preparación' | 'Listo' | 'Entregado' | 'Cancelado';

export interface ItemPedido {
  productoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: number;
  tiendaId: number;
  cliente: string;
  items: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  modalidad: 'Retiro en tienda' | 'Entrega a domicilio';
  creadoEn: Date;
}