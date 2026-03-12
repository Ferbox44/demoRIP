import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, TEST_ACCOUNTS } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email        = signal('');
  password     = signal('');
  showPassword = signal(false);
  error        = signal('');
  loading      = signal(false);

  accounts = TEST_ACCOUNTS;

  fillAccount(email: string, password: string) {
    this.email.set(email);
    this.password.set(password);
    this.error.set('');
  }

  togglePassword() { this.showPassword.update(v => !v); }

  onEmailChange(val: string) { this.email.set(val); this.error.set(''); }
  onPasswordChange(val: string) { this.password.set(val); this.error.set(''); }

  async submit() {
    if (!this.email() || !this.password()) {
      this.error.set('Por favor ingresa tu correo y contraseña.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    // small delay to simulate async
    await new Promise(r => setTimeout(r, 400));
    const result = this.auth.login(this.email(), this.password());
    this.loading.set(false);
    if (result.ok) {
      // Contabilidad goes directly to inventory
      const role = this.auth.role();
      if (role === 'Contabilidad') {
        this.router.navigate(['/inventario']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.error.set(result.error ?? 'Error de autenticación');
    }
  }
}
