import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Rol } from '../models/usuario.model';

interface Credencial {
  email: string;
  password: string;
  usuario: Usuario;
}

const CREDENCIALES_MOCK: Credencial[] = [
  {
    email: 'cliente', password: '1234',
    usuario: { id: 1, nombre: 'Camila Rojas', email: 'cliente', rol: 'cliente' }
  },
  {
    email: 'admin', password: '1234',
    usuario: { id: 2, nombre: 'Dueño Pan Artesanal', email: 'admin', rol: 'admin_local', tiendaId: 1 }
  },
  {
    email: 'general', password: '1234',
    usuario: { id: 3, nombre: 'Directiva Pedidos 360', email: 'general@pedidos360.cl', rol: 'admin_general' }
  },
  {
    email: 'cocina', password: '1234',
    usuario: { id: 4, nombre: 'Jefe de Cocina - Local 1', email: 'cocina@pedidos360.cl', rol: 'cocina', tiendaId: 1 }
  },
  {
    email: 'repartidor', password: '1234',
    usuario: { id: 5, nombre: 'Carlos Delivery', email: 'repartidor@pedidos360.cl', rol: 'repartidor', tiendaId: 1 }
  }
];

const STORAGE_KEY = 'pedidos360_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuarioActual = signal<Usuario | null>(this.recuperarSesion());
  estaAutenticado = computed(() => this.usuarioActual() !== null);

  // 👇 Nuevo: roles que trae el token de Azure, para el selector
  rolesDisponibles = signal<Rol[]>([]);
  private azurePendiente: { nombre: string; email: string } | null = null;

  login(email: string, password: string): Observable<Usuario | null> {
    const match = CREDENCIALES_MOCK.find(
      c => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
    );
    const usuario = match ? match.usuario : null;

    if (usuario) {
      this.usuarioActual.set(usuario);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
    }

    return of(usuario).pipe(delay(400));
  }

  // 👇 Nuevo: se llama apenas vuelve el login de Microsoft
  loginConAzure(datosBase: { nombre: string; email: string }, roles: Rol[]): void {
    this.rolesDisponibles.set(roles);
    this.azurePendiente = datosBase;

    // Si solo tiene un rol, entra directo sin mostrar selector
    if (roles.length === 1) {
      this.seleccionarRol(roles[0]);
    }
  }

  // 👇 Nuevo: se llama al elegir un rol (desde el selector, o automático si hay solo uno)
  seleccionarRol(rol: Rol): void {
    if (!this.azurePendiente) return;

    const usuario: Usuario = {
      id: 0, // Azure no entrega un id numérico; si luego sincronizas con tu backend, reemplázalo ahí
      nombre: this.azurePendiente.nombre,
      email: this.azurePendiente.email,
      rol
    };

    this.usuarioActual.set(usuario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  }

  logout(): void {
    this.usuarioActual.set(null);
    this.rolesDisponibles.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private recuperarSesion(): Usuario | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Usuario : null;
  }
}