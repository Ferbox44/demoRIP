import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { UserRole } from '../../models/models';

interface NavItem { label: string; route: string; badge?: number; movGroup?: boolean; }

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  CEO: [
    { label: 'Dashboard',      route: '/dashboard' },
    { label: 'Inventario',     route: '/inventario' },
    { label: 'Movimientos',    route: '/entradas', movGroup: true },
    { label: 'Reportes',       route: '/reportes' },
    { label: 'Alertas',        route: '/alertas' },
    { label: 'Configuración',  route: '/configuracion' },
  ],
  Gerente: [
    { label: 'Dashboard',   route: '/dashboard' },
    { label: 'Inventario',  route: '/inventario' },
    { label: 'Movimientos', route: '/entradas', movGroup: true },
    { label: 'Alertas',     route: '/alertas' },
  ],
  EncInventario: [
    { label: 'Dashboard',          route: '/dashboard' },
    { label: 'Entradas',           route: '/entradas' },
    { label: 'Salidas',            route: '/salidas' },
    { label: 'Equipos de Velación',route: '/equipos' },
    { label: 'Devoluciones',       route: '/devoluciones' },
  ],
  Contabilidad: [
    { label: 'Inventario', route: '/inventario' },
    { label: 'Reportes',   route: '/reportes' },
  ],
};

const MOVIMIENTOS_ROUTES = ['/entradas', '/salidas', '/equipos', '/devoluciones'];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private auth  = inject(AuthService);
  private inv   = inject(InventoryService);

  user      = this.auth.currentUser;
  alertCount = computed(() => this.inv.getUnreadAlertsCount());

  navItems = computed<NavItem[]>(() => {
    const role = this.user()?.role;
    const items = role ? NAV_BY_ROLE[role] ?? [] : [];
    return items.map(it => it.label === 'Alertas' ? { ...it, badge: this.alertCount() } : it);
  });

  isMovimientosActive(item: NavItem, currentUrl: string): boolean {
    if (!item.movGroup) return false;
    return MOVIMIENTOS_ROUTES.some(r => currentUrl.startsWith(r));
  }

  logout() { this.auth.logout(); }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}
