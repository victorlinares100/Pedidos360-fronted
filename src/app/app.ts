import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from './core/services/auth.service'; // ajusta la ruta si es distinta
import { Rol } from './core/models/usuario.model';
import { RUTAS_POR_ROL } from './core/services/rutas-por-rol';

const SCOPE_BACKEND = 'api://8f72ba0f-8036-40e2-9465-c8ae3891444d/access_as_user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('pedidos360-frontend');

  private msalService = inject(MsalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (!result?.account) return;

        this.msalService.instance.setActiveAccount(result.account);

        const claims = result.account.idTokenClaims as any;
        const roles: Rol[] = (claims?.roles ?? []) as Rol[];

        this.authService.loginConAzure(
          { nombre: claims?.name ?? 'Usuario Microsoft', email: claims?.preferred_username ?? '' },
          roles
        );

        if (roles.length > 1) {
          this.router.navigate(['/seleccion-rol']);
        } else if (roles.length === 1) {
          this.router.navigate([RUTAS_POR_ROL[roles[0]] ?? '/']);
        } else {
          console.warn('Este usuario no tiene ningún rol asignado en Azure.');
          this.router.navigate(['/login']);
        }

        this.msalService.acquireTokenSilent({
          scopes: [SCOPE_BACKEND],
          account: result.account
        }).subscribe({
          next: (res) => console.log('TOKEN:', res.accessToken),
          error: (err) => console.error('Error obteniendo token:', err)
        });
      },
      error: (err) => console.error('[App] Error en redirect:', err)
    });
  }
}