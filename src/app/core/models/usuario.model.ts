export type Rol = 'cliente' | 'admin_local' | 'admin_general' | 'cocina' | 'repartidor';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  tiendaId?: number; // aplica a admin_local y cocina, que están atados a 1 tienda
}