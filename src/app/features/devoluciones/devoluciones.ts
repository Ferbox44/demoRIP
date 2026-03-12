import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-devoluciones',
  imports: [RouterLink],
  template: `
    <div class="page-wrapper">
      <div class="page-content">
        <div class="breadcrumb">
          <a routerLink="/dashboard">Inicio</a>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Devoluciones</span>
        </div>
        <div class="flex items-center justify-between mb-lg">
          <div>
            <h1 class="page-title">Devoluciones</h1>
            <p class="text-secondary text-sm" style="margin-top:4px">Registro de retornos de productos rentados</p>
          </div>
          <button class="btn btn-primary" routerLink="/salidas">+ Nueva Devolución</button>
        </div>
        <div class="card" style="padding:0;overflow:hidden">
          <table class="data-table">
            <thead>
              <tr>
                <th>NFC</th><th>Producto</th><th>Cliente</th><th>Fecha Salida</th><th>Retorno Esperado</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of rentaProducts(); track p.id) {
                <tr>
                  <td><span class="nfc-tag">📶 {{ p.nfcCode }}</span></td>
                  <td class="fw-600">{{ p.description }}</td>
                  <td class="text-secondary">Cliente en servicio</td>
                  <td class="text-muted text-xs">{{ p.lastUpdated }}</td>
                  <td class="text-secondary">Pendiente</td>
                  <td><span class="badge badge-en-renta">En Renta</span></td>
                  <td><button class="btn btn-secondary btn-xs">✅ Registrar Retorno</button></td>
                </tr>
              }
              @if (rentaProducts().length === 0) {
                <tr><td colspan="7"><div class="empty-state" style="padding:48px"><div class="empty-state-icon">🔄</div><p class="empty-state-title">Sin devoluciones pendientes</p></div></td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: ['.mb-lg { margin-bottom: 24px; }']
})
export class DevolucionesComponent {
  inv = inject(InventoryService);
  rentaProducts = () => this.inv.products().filter(p => p.status === 'En Renta');
}
