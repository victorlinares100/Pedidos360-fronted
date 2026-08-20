import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Rol } from '../models/usuario.model';

export function rolGuard(rolesPermitidos: Rol[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuario = authService.usuarioActual();

    if (!usuario) {
      router.navigate(['/login']);
      return false;
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
      router.navigate(['/']);
      return false;
    }

    return true;
  };
}