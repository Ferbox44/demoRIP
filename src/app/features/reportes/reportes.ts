import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-reportes',
  imports: [],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {
  auth = inject(AuthService);
  inv  = inject(InventoryService);

  monthlyData = [
    { month: 'Oct', value: 42000, pct: 62 },
    { month: 'Nov', value: 38500, pct: 57 },
    { month: 'Dic', value: 71000, pct: 100 },
    { month: 'Ene', value: 55000, pct: 78 },
    { month: 'Feb', value: 48000, pct: 68 },
    { month: 'Mar', value: 63500, pct: 89 },
  ];

  branchData = [
    { name: 'CEDIS Pino Suárez', count: 12, pct: 100 },
  ];

  recentMovements = [
    { user: 'Claudia',  action: 'Entrada registrada',    product: 'NFC-001 Ataúd Roble Natural',      time: '11 Mar, 09:15' },
    { user: 'Claudia',  action: 'Salida — Renta',        product: 'NFC-008 Ataúd Caoba Dorado',       time: '11 Mar, 08:00' },
    { user: 'Claudia',  action: 'Producto dañado',       product: 'NFC-005 Ataúd Pino Natural',       time: '09 Mar, 08:45' },
    { user: 'Claudia',  action: 'Producto reservado',    product: 'NFC-006 Urna Bronce Clásico',      time: '10 Mar, 13:00' },
    { user: 'Claudia',  action: 'Venta definitiva',      product: 'NFC-007 Ataúd Roble Premium',      time: '05 Mar, 17:00' },
    { user: 'Ernesto Garrido',  action: 'Reporte generado',      product: 'Reporte Mensual Febrero 2026',     time: '01 Mar, 10:00' },
    { user: 'Claudia',  action: 'Entrada registrada',    product: 'NFC-010 Ataúd Metálico Estándar',  time: '01 Mar, 12:00' },
    { user: 'Claudia',  action: 'Sanitizado',            product: 'NFC-001 Ataúd Roble Natural',      time: '05 Feb, 12:00' },
    { user: 'Claudia',  action: 'Entrada registrada',    product: 'NFC-009 Urna Mármol Blanco',       time: '11 Mar, 10:00' },
    { user: 'Claudia',  action: 'Pendiente de revisión', product: 'NFC-009 Urna Mármol Blanco',       time: '11 Mar, 10:00' },
  ];
}
