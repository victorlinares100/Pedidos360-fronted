import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  cargando = signal(false);
  error = signal('');

  private msalService = inject(MsalService);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error.set('');
    this.cargando.set(true);

    this.authService.login(this.email(), this.password()).subscribe(usuario => {
      this.cargando.set(false);

      if (!usuario) {
        this.error.set('Correo o contraseña incorrectos');
        return;
      }

      // Redirección según el rol del usuario autenticado
      switch (usuario.rol) {
        case 'admin_local':
          this.router.navigate(['/admin-local']);
          break;
        case 'admin_general':
          this.router.navigate(['/admin-general']);
          break;
        case 'cocina':
          this.router.navigate(['/cocina']);
          break;
        case 'repartidor':
          this.router.navigate(['/repartidor']);
          break;
        case 'cliente':
        default:
          this.router.navigate(['/']);
          break;
      }
    });
  }

  // Login con Microsoft (Azure AD)
  loginConMicrosoft(): void {
    this.error.set('');
    this.cargando.set(true);

    this.msalService.loginPopup().subscribe({
      next: (result) => {
        this.cargando.set(false);
        const cuenta = result.account;
        console.log('Cuenta de Microsoft:', cuenta);

        // TODO: Vincular el token JWT devuelto por Azure AD para navegar según el rol retornado
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('No se pudo iniciar sesión con Microsoft');
        console.error(err);
      }
    });
  }
}