import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

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

  ngOnInit(): void {
    this.msalService.handleRedirectObservable().subscribe({
      next: (result) => {
        console.log('[App] Respuesta de login:', result);

        if (result?.account) {
          this.msalService.instance.setActiveAccount(result.account);

          this.msalService.acquireTokenSilent({
            scopes: [SCOPE_BACKEND],
            account: result.account
          }).subscribe({
            next: (res) => console.log('TOKEN:', res.accessToken),
            error: (err) => console.error('Error obteniendo token:', err)
          });
        }
      },
      error: (err) => console.error('[App] Error en redirect:', err)
    });
  }
}