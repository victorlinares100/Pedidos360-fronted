import { Rol } from '../models/usuario.model';

export const RUTAS_POR_ROL: Record<Rol, string> = {
  admin_general: '/admin-general',
  admin_local: '/admin-local',
  cocina: '/cocina',
  repartidor: '/repartidor',
  cliente: '/'
};