import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Client } from '../../models/models';

interface OrderItem { category: string; icon: string; qty: number; max: number; }

@Component({
  selector: 'app-equipos-velacion',
  imports: [FormsModule],
  templateUrl: './equipos-velacion.html',
  styleUrl: './equipos-velacion.css'
})
export class EquiposVelacionComponent {
  inv = inject(InventoryService);

  equipment = this.inv.equipment;
  clients   = this.inv.clients;

  // Order drawer state
  showDrawer   = signal(false);
  orderItems   = signal<OrderItem[]>([]);

  // Client selection
  clientSearch   = signal('');
  selectedClient = signal<Client | null>(null);
  clientMode     = signal<'list' | 'search'>('list');

  // Service info
  location    = signal('');
  responsible = signal('');
  driver      = signal('');

  // Saved toast
  showSaved = signal(false);

  filteredClients = computed(() => {
    const q = this.clientSearch().toLowerCase();
    if (!q) return this.clients().slice(0, 6);
    return this.clients().filter(c => c.name.toLowerCase().includes(q)).slice(0, 8);
  });

  totalOrderItems = computed(() => this.orderItems().reduce((sum, i) => sum + i.qty, 0));

  canRegister = computed(() =>
    this.totalOrderItems() > 0 &&
    this.selectedClient() !== null &&
    this.location() !== ''
  );

  openDrawer() {
    this.orderItems.set(
      this.equipment().map(g => ({ category: g.category, icon: g.icon, qty: 0, max: g.available }))
    );
    this.selectedClient.set(null);
    this.clientSearch.set('');
    this.location.set('');
    this.responsible.set('');
    this.driver.set('');
    this.showDrawer.set(true);
  }

  closeDrawer() { this.showDrawer.set(false); }

  setQty(category: string, delta: number) {
    this.orderItems.update(items =>
      items.map(i => i.category === category
        ? { ...i, qty: Math.max(0, Math.min(i.qty + delta, i.max)) }
        : i)
    );
  }

  confirmOrder() {
    this.showDrawer.set(false);
    this.showSaved.set(true);
    setTimeout(() => this.showSaved.set(false), 3000);
  }
}
