import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { Product, ProductStatus, ProductType } from '../../models/models';

@Component({
  selector: 'app-inventario',
  imports: [RouterLink, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class InventarioComponent {
  auth = inject(AuthService);
  inv  = inject(InventoryService);

  activeTab      = signal<'lista' | 'real'>('lista');
  searchQuery    = signal('');
  statusFilter   = signal<ProductStatus | ''>('');
  typeFilter     = signal<ProductType | ''>('');
  selectedRow    = signal<string | null>(null);

  user         = this.auth.currentUser;
  isReadOnly   = computed(() => this.auth.isReadOnly());
  canSeeCost   = computed(() => this.auth.canSeeCostPrice());

  allProducts = this.inv.products;

  filtered = computed(() => {
    let p = this.allProducts();
    const q = this.searchQuery().toLowerCase();
    if (q) p = p.filter(x =>
      x.description.toLowerCase().includes(q) ||
      x.nfcCode.toLowerCase().includes(q) ||
      x.supplier.toLowerCase().includes(q)
    );
    if (this.statusFilter()) p = p.filter(x => x.status === this.statusFilter());
    if (this.typeFilter())   p = p.filter(x => x.type   === this.typeFilter());
    return p;
  });

  statuses: ProductStatus[] = ['Disponible','Dañado','En Renta','Pendiente','Reservado','Vendido'];
  types: ProductType[] = ['Ataúd','Urna','Equipo'];

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

  selectRow(id: string) { this.selectedRow.set(this.selectedRow() === id ? null : id); }

  realInventoryGroups = computed(() => {
    const p = this.allProducts();
    return this.statuses.map(s => ({
      status: s,
      count: p.filter(x => x.status === s).length,
      items: p.filter(x => x.status === s),
      badgeClass: this.badgeClass(s),
    })).filter(g => g.count > 0);
  });
}
