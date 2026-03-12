import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { ProductType, ProductStatus } from '../../models/models';

type Step = 1 | 2 | 3 | 4;
type Condition = 'BUENO' | 'DAÑADO' | null;

@Component({
  selector: 'app-nueva-entrada',
  imports: [FormsModule],
  templateUrl: './nueva-entrada.html',
  styleUrl: './nueva-entrada.css'
})
export class NuevaEntradaComponent {
  router = inject(Router);
  inv    = inject(InventoryService);

  currentStep = signal<Step>(1);
  saved       = signal(false);

  // Step 1 fields
  orderNum     = signal('');
  orderDate    = signal('');
  orderSupplier= signal('');

  // Step 2 fields
  nfcCode     = signal('');
  description = signal('');
  model       = signal('');
  type        = signal<ProductType | ''>('');
  supplier    = signal('');
  recepDate   = signal(new Date().toISOString().slice(0,10));
  costPrice   = signal('');
  salePrice   = signal('');

  // Step 3
  condition    = signal<Condition>(null);
  damageDesc   = signal('');
  genReturn    = signal(false);

  types: ProductType[] = ['Ataúd', 'Urna', 'Equipo'];
  suppliers = ['Pino Suárez Funeraria', 'Artesanos del Norte', 'Cofres Garza', 'Arte Funerario MX'];

  catalogue = [
    { model: 'Heritage Classic',   costPrice: 8500,  salePrice: 15000 },
    { model: 'Serenity Premium',   costPrice: 12000, salePrice: 22000 },
    { model: 'Elegance Gold',      costPrice: 18000, salePrice: 35000 },
    { model: 'Natural Cedar',      costPrice: 6500,  salePrice: 11500 },
    { model: 'White Pearl',        costPrice: 14000, salePrice: 28000 },
    { model: 'Ebony Prestige',     costPrice: 20000, salePrice: 42000 },
    { model: 'Classic Bronze',     costPrice: 9500,  salePrice: 17500 },
    { model: 'Urna Mármol Blanco', costPrice: 3500,  salePrice: 7000  },
    { model: 'Urna Madera Noble',  costPrice: 2800,  salePrice: 5500  },
  ];

  onModelChange(value: string) {
    this.model.set(value);
    const match = this.catalogue.find(m => m.model === value);
    if (match) {
      this.costPrice.set(match.costPrice.toString());
      this.salePrice.set(match.salePrice.toString());
    }
  }

  steps = [
    { n: 1, label: 'Revisión Orden' },
    { n: 2, label: 'Captura Producto' },
    { n: 3, label: 'Estado' },
    { n: 4, label: 'Confirmación' },
  ];

  stepState(n: number): 'active' | 'done' | 'inactive' {
    if (n < this.currentStep()) return 'done';
    if (n === this.currentStep()) return 'active';
    return 'inactive';
  }

  simulateNfcScan() {
    const codes = ['NFC-013','NFC-014','NFC-015'];
    this.nfcCode.set(codes[Math.floor(Math.random()*codes.length)]);
  }

  next() {
    const s = this.currentStep();
    if (s < 4) this.currentStep.set((s + 1) as Step);
  }
  prev() {
    const s = this.currentStep();
    if (s > 1) this.currentStep.set((s - 1) as Step);
  }

  canNext = computed(() => {
    switch (this.currentStep()) {
      case 1: return this.orderNum() !== '' && this.orderDate() !== '';
      case 2: return this.nfcCode() !== '' && this.description() !== '' && this.type() !== '';
      case 3: return this.condition() !== null;
      default: return true;
    }
  });

  confirm() {
    const status: ProductStatus =
      this.condition() === 'BUENO' ? 'Disponible' : 'Dañado';

    this.inv.addProduct({
      id: Date.now().toString(),
      nfcCode: this.nfcCode(),
      type: this.type() as ProductType,
      description: this.description(),
      material: '',
      model: this.model(),
      supplier: this.supplier(),
      size: 'Estándar',
      costPrice: parseFloat(this.costPrice()) || 0,
      salePrice: parseFloat(this.salePrice()) || 0,
      status,
      branch: 'CEDIS Pino Suárez',
      lastUpdated: new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
      history: [
        { id: '1', date: new Date().toLocaleDateString('es-MX'), action: 'Alta en Sistema', description: `Entrada registrada — Orden ${this.orderNum()}`, user: 'Claudia', status }
      ]
    });
    this.saved.set(true);
  }

  goBack() { this.router.navigate(['/dashboard']); }
}
