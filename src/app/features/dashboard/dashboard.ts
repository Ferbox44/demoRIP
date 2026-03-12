import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { Product, ProductStatus } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  auth = inject(AuthService);
  inv  = inject(InventoryService);

  user     = this.auth.currentUser;
  products = this.inv.products;
  alerts   = this.inv.alerts;

  counts = computed(() => {
    const p = this.products();
    return {
      total:      p.length,
      disponible: p.filter(x => x.status === 'Disponible').length,
      vendido:    p.filter(x => x.status === 'Vendido').length,
      reservado:  p.filter(x => x.status === 'Reservado').length,
      enRenta:    p.filter(x => x.status === 'En Renta').length,
      danado:     p.filter(x => x.status === 'Dañado').length,
    };
  });

  recentProducts = computed(() => this.products().slice(0, 8));
  recentAlerts   = computed(() => this.alerts().slice(0, 5));

  canSeeFinancials = computed(() => this.auth.canSeeFinancials());
  isCEO            = computed(() => this.auth.isCEO());

  ingresos = '$63.500';

  badgeClass(status: ProductStatus): string {
    const map: Record<ProductStatus, string> = {
      'Disponible': 'badge-disponible',
      'Dañado':     'badge-dañado',
      'En Renta':   'badge-en-renta',
      'Pendiente':  'badge-pendiente',
      'Reservado':  'badge-reservado',
      'Vendido':    'badge-vendido',
    };
    return map[status] ?? 'badge-pendiente';
  }
}
