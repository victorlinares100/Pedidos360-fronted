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

  // Tu login normal, sin cambios
  onSubmit(): void {
    this.error.set('');
    this.cargando.set(true);

    this.authService.login(this.email(), this.password()).subscribe(usuario => {
      this.cargando.set(false);

      if (!usuario) {
        this.error.set('Correo o contraseña incorrectos');
        return;
      }

      if (usuario.rol === 'admin_local') {
        this.router.navigate(['/admin-local']);
      } else {
        this.router.navigate(['/']);
      }

      if (usuario.rol === 'admin_local') {
        this.router.navigate(['/admin-local']);
      } else if (usuario.rol === 'admin_general') {
        this.router.navigate(['/admin-general']);
        } else {
          
  this.router.navigate(['/']);
}
    });
  }

  

  // Login nuevo con Microsoft
  loginConMicrosoft(): void {
    this.error.set('');
    this.cargando.set(true);

    this.msalService.loginPopup().subscribe({
      next: (result) => {
        this.cargando.set(false);
        const cuenta = result.account;
        console.log('Cuenta de Microsoft:', cuenta);

        // TODO: aquí decides qué hacer con esa cuenta.
        // Opción A: mandarla a tu backend para crear/vincular el usuario y obtener su rol real
        // this.authService.loginConMicrosoft(cuenta).subscribe(usuario => { ... navegar según rol ... });

        // Opción B (temporal, sin validar contra tu backend):
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