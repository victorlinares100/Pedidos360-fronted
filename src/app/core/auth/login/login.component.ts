import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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

      if (usuario.rol === 'admin_local') {
        this.router.navigate(['/admin-local']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}