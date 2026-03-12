import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Account, User, UserRole } from '../models/models';

export const TEST_ACCOUNTS: Account[] = [
  { email: 'Ernesto@Garrido.com',          password: '1234', name: 'Ernesto Garrido',   role: 'CEO',           roleLabel: 'CEO' },
  { email: 'Mirna@Garrido.com',            password: '1234', name: 'Mirna Garrido',     role: 'CEO',           roleLabel: 'CEO' },
  { email: 'CarolinaArroyo@VGarrido.com',  password: '5678', name: 'Carolina Arroyo',   role: 'Gerente',       roleLabel: 'Gerente', branch: 'CEDIS Pino Suárez' },
  { email: 'CarlosGarrido@VGarrido.com',   password: '5678', name: 'Carlos Garrido',    role: 'Gerente',       roleLabel: 'Gerente', branch: 'CEDIS Pino Suárez' },
  { email: 'claudia@funeraria.com',         password: '7890', name: 'Claudia',   role: 'EncInventario', roleLabel: 'Enc. Inventario', branch: 'CEDIS Pino Suárez' },
  { email: 'brenda@funeraria.com',          password: '4321', name: 'Brenda',    role: 'Contabilidad',  roleLabel: 'Contabilidad' },
];

const STORAGE_KEY = 'inv_fur_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this._loadUser());

  readonly currentUser  = this._user.asReadonly();
  readonly isLoggedIn   = computed(() => this._user() !== null);
  readonly role         = computed(() => this._user()?.role ?? null);
  readonly userBranch   = computed(() => this._user()?.branch ?? 'CEDIS Pino Suárez');

  constructor(private router: Router) {}

  login(email: string, password: string): { ok: boolean; error?: string } {
    const acct = TEST_ACCOUNTS.find(
      a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!acct) return { ok: false, error: 'Correo o contraseña incorrectos' };

    const user: User = {
      email: acct.email,
      name: acct.name,
      role: acct.role,
      roleLabel: acct.roleLabel,
      branch: acct.branch,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._user.set(user);
    return { ok: true };
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  hasRole(roles: UserRole[]): boolean {
    const u = this._user();
    return u ? roles.includes(u.role) : false;
  }

  canSeeFinancials()  { return this.hasRole(['CEO', 'Contabilidad']); }
  canSeeCostPrice()   { return this.hasRole(['CEO', 'Contabilidad']); }
  canEdit()           { return this.hasRole(['CEO', 'Gerente', 'EncInventario']); }
  isReadOnly()        { return this.hasRole(['Contabilidad']); }
  isCEO()             { return this.hasRole(['CEO']); }
  isEncInventario()   { return this.hasRole(['EncInventario']); }

  private _loadUser(): User | null {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  }
}
