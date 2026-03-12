import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Alert } from '../../models/models';

@Component({
  selector: 'app-alertas',
  imports: [RouterLink],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css'
})
export class AlertasComponent {
  inv = inject(InventoryService);
  alerts = this.inv.alerts;

  markRead(id: string) { this.inv.markAlertRead(id); }
  markAllRead() { this.alerts().forEach(a => this.inv.markAlertRead(a.id)); }

  iconFor(type: Alert['type']): string {
    const m: Record<string, string> = { warning: '⚠️', error: '❌', info: 'ℹ️', success: '✅' };
    return m[type] ?? 'ℹ️';
  }
  iconClass(type: Alert['type']): string {
    return `alert-icon-${type}`;
  }
}
