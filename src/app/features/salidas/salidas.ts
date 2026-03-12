import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';
import { Client, Product } from '../../models/models';

type ServiceType = 'renta' | 'venta' | null;
type ClientSelectMode = 'list' | 'search';

interface ExitRecord {
  id: string;
  date: string;
  client: string;
  product: string;
  nfcCode: string;
  serviceType: 'Renta' | 'Venta';
  price: number;
}

@Component({
  selector: 'app-salidas',
  imports: [FormsModule, RouterLink],
  templateUrl: './salidas.html',
  styleUrl: './salidas.css'
})
export class SalidasComponent {
  auth = inject(AuthService);
  inv  = inject(InventoryService);

  // Client Selection
  clientMode     = signal<ClientSelectMode>('list');
  clientSearch   = signal('');
  selectedClient = signal<Client | null>(null);

  // Product Selection
  productSearch  = signal('');
  selectedProduct = signal<Product | null>(null);

  // Service Type
  serviceType    = signal<ServiceType>(null);

  // Renta fields
  rentaLocation  = signal('');
  rentaDate      = signal('');

  // Modal
  showModal      = signal(false);
  saved          = signal(false);

  history = signal<ExitRecord[]>([
    { id: '1', date: '10/mar/2026', client: 'María González',  product: 'Ataúd Roble Premium',   nfcCode: 'NFC-001', serviceType: 'Venta', price: 15000 },
    { id: '2', date: '08/mar/2026', client: 'Roberto Silva',   product: 'Ataúd Caoba Imperial',  nfcCode: 'NFC-002', serviceType: 'Renta', price: 12000 },
    { id: '3', date: '05/mar/2026', client: 'Ana Martínez',    product: 'Urna Mármol Premium',   nfcCode: 'NFC-004', serviceType: 'Venta', price: 8500  },
    { id: '4', date: '01/mar/2026', client: 'Carlos Herrera',  product: 'Ataúd Pino Natural',    nfcCode: 'NFC-006', serviceType: 'Renta', price: 9000  },
    { id: '5', date: '22/feb/2026', client: 'Laura Mendoza',   product: 'Ataúd Cedro Clásico',   nfcCode: 'NFC-007', serviceType: 'Venta', price: 11500 },
  ]);

  allClients = this.inv.clients;
  allProducts = this.inv.products;

  availableProducts = computed(() =>
    this.allProducts().filter(p => p.status === 'Disponible')
  );

  filteredClients = computed(() => {
    const q = this.clientSearch().toLowerCase();
    if (!q) return this.allClients().slice(0, 8);
    return this.allClients().filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.folio ?? '').toLowerCase().includes(q)
    ).slice(0, 10);
  });

  filteredProducts = computed(() => {
    const q = this.productSearch().toLowerCase();
    const products = this.availableProducts();
    if (!q) return products;
    return products.filter(p =>
      p.description.toLowerCase().includes(q) ||
      p.nfcCode.toLowerCase().includes(q)
    );
  });

  canConfirm = computed(() =>
    this.selectedClient() !== null &&
    this.selectedProduct() !== null &&
    this.serviceType() !== null
  );

  selectClient(c: Client) { this.selectedClient.set(c); }
  selectProduct(p: Product) { this.selectedProduct.set(p); }

  confirm() {
    if (!this.canConfirm()) return;
    const newStatus = this.serviceType() === 'renta' ? 'En Renta' : 'Vendido';
    this.inv.updateProductStatus(this.selectedProduct()!.nfcCode, newStatus);
    this.history.update(h => [{
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      client: this.selectedClient()!.name,
      product: this.selectedProduct()!.description,
      nfcCode: this.selectedProduct()!.nfcCode,
      serviceType: this.serviceType() === 'renta' ? 'Renta' : 'Venta',
      price: this.selectedProduct()!.salePrice,
    }, ...h]);
    this.showModal.set(false);
    this.saved.set(true);
  }

  reset() {
    this.selectedClient.set(null);
    this.selectedProduct.set(null);
    this.serviceType.set(null);
    this.saved.set(false);
    this.rentaLocation.set('');
    this.rentaDate.set('');
  }

  contractBadge(c: Client): string {
    return c.contractType === 'Previsorio' ? 'badge-previsorio' : 'badge-uso-inmediato';
  }
}
