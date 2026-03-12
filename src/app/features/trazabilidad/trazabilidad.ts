import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { Product, ProductStatus } from '../../models/models';

@Component({
  selector: 'app-trazabilidad',
  imports: [RouterLink],
  templateUrl: './trazabilidad.html',
  styleUrl: './trazabilidad.css'
})
export class TrazabilidadComponent {
  private route = inject(ActivatedRoute);
  private inv   = inject(InventoryService);
  auth          = inject(AuthService);

  id = this.route.snapshot.paramMap.get('id') ?? '';

  product = computed(() => this.inv.getProduct(this.id));

  canSeeCost = computed(() => this.auth.canSeeCostPrice());

  badgeClass(status: ProductStatus): string {
    const m: Record<ProductStatus, string> = {
      'Disponible': 'badge-disponible',
      'Dañado':     'badge-dañado',
      'En Renta':   'badge-en-renta',
      'Pendiente':  'badge-pendiente',
      'Reservado':  'badge-reservado',
      'Vendido':    'badge-vendido',
    };
    return m[status] ?? 'badge-pendiente';
  }

  timelineDotColor(status: ProductStatus): string {
    const m: Record<ProductStatus, string> = {
      'Disponible': 'var(--green)',
      'Dañado':     'var(--red)',
      'En Renta':   'var(--amber)',
      'Pendiente':  'var(--gray)',
      'Reservado':  'var(--blue-gray)',
      'Vendido':    'var(--dark-gray)',
    };
    return m[status] ?? 'var(--gray)';
  }
}
