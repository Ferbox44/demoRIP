import { Injectable, signal } from '@angular/core';
import { Product, Client, EquipmentGroup, Alert } from '../models/models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private _products = signal<Product[]>(PRODUCTS);
  private _alerts   = signal<Alert[]>(ALERTS);

  readonly products     = this._products.asReadonly();
  readonly alerts       = this._alerts.asReadonly();
  readonly equipment    = signal<EquipmentGroup[]>(EQUIPMENT_GROUPS);
  readonly clients      = signal<Client[]>(CLIENTS);

  getProduct(id: string): Product | undefined {
    return this._products().find(p => p.id === id || p.nfcCode === id);
  }

  getUnreadAlertsCount(): number {
    return this._alerts().filter(a => !a.read).length;
  }

  markAlertRead(id: string): void {
    this._alerts.update(alerts => alerts.map(a => a.id === id ? { ...a, read: true } : a));
  }

  addProduct(p: Product): void {
    this._products.update(arr => [p, ...arr]);
  }

  updateProductStatus(nfc: string, status: Product['status']): void {
    this._products.update(arr => arr.map(p => p.nfcCode === nfc ? { ...p, status, lastUpdated: now() } : p));
  }
}

function now() {
  return new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ============ MOCK DATA ============

const PRODUCTS: Product[] = [
  {
    id: '1', nfcCode: 'NFC-001', type: 'Ataúd', description: 'Ataúd Roble Natural', material: 'Madera de Roble',
    model: 'Premium Classic', supplier: 'Pino Suárez Funeraria', size: 'Grande',
    costPrice: 12000, salePrice: 18500, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '11 Mar 2026, 09:15',
    history: [
      { id: 'h1', date: '15 Ene 2026, 08:00', action: 'Fabricado en Fábrica', description: 'Producción completada en fábrica principal', user: 'Fábrica PSF', status: 'Disponible' },
      { id: 'h2', date: '20 Ene 2026, 14:30', action: 'Recibido en CEDIS Pino Suárez', description: 'Recepción de mercancía — orden #ORD-0045', user: 'Claudia', status: 'Pendiente' },
      { id: 'h3', date: '20 Ene 2026, 15:00', action: 'Fotografiado y Etiquetado', description: 'Registro fotográfico y etiqueta NFC aplicada', user: 'Claudia', status: 'Pendiente' },
      { id: 'h4', date: '21 Ene 2026, 09:00', action: 'Alta en Sistema', description: 'Producto dado de alta en inventario digital', user: 'Claudia', status: 'Disponible' },
      { id: 'h5', date: '03 Feb 2026, 11:00', action: 'Salida — Renta Cremación', description: 'Servicio fúnebre #SRV-102 · Cliente: María González', user: 'Claudia', status: 'En Renta' },
      { id: 'h6', date: '05 Feb 2026, 10:00', action: 'Regresado a CEDIS', description: 'Retorno post-servicio de cremación', user: 'Claudia', status: 'Pendiente' },
      { id: 'h7', date: '05 Feb 2026, 12:00', action: 'Sanitizado y Revisado', description: 'Limpieza y revisión de condición', user: 'Claudia', status: 'Disponible' },
      { id: 'h8', date: '05 Feb 2026, 12:30', action: 'Disponible en CEDIS', description: 'Listo para siguiente servicio', user: 'Claudia', status: 'Disponible' },
    ]
  },
  {
    id: '2', nfcCode: 'NFC-002', type: 'Ataúd', description: 'Ataúd Caoba Clásico', material: 'Madera de Caoba',
    model: 'Heritage', supplier: 'Artesanos del Norte', size: 'Mediano',
    costPrice: 15000, salePrice: 22000, status: 'En Renta', branch: 'CEDIS Pino Suárez',
    lastUpdated: '10 Mar 2026, 16:00',
    history: [
      { id: 'h1', date: '10 Feb 2026, 09:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia', status: 'Disponible' },
      { id: 'h2', date: '10 Mar 2026, 16:00', action: 'Salida — Renta Cremación', description: 'Servicio #SRV-118 · Cliente: Carlos Hernández', user: 'Claudia', status: 'En Renta' },
    ]
  },
  {
    id: '3', nfcCode: 'NFC-003', type: 'Ataúd', description: 'Ataúd Metálico Premium', material: 'Acero 18 Calibre',
    model: 'Guardian Steel', supplier: 'Cofres Garza', size: 'Grande',
    costPrice: 22000, salePrice: 35000, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '08 Mar 2026, 11:30',
    history: [
      { id: 'h1', date: '01 Feb 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
    ]
  },
  {
    id: '4', nfcCode: 'NFC-004', type: 'Urna', description: 'Urna Cerámica Blanca', material: 'Cerámica de Alta Temperatura',
    model: 'Paz Eterna', supplier: 'Arte Funerario MX', size: 'Estándar',
    costPrice: 2800, salePrice: 4500, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '07 Mar 2026, 14:00',
    history: [
      { id: 'h1', date: '05 Mar 2026, 09:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
    ]
  },
  {
    id: '5', nfcCode: 'NFC-005', type: 'Ataúd', description: 'Ataúd Pino Natural', material: 'Madera de Pino',
    model: 'Eco Sereno', supplier: 'Pino Suárez Funeraria', size: 'Pequeño',
    costPrice: 6500, salePrice: 12000, status: 'Dañado', branch: 'CEDIS Pino Suárez',
    lastUpdated: '09 Mar 2026, 08:45',
    history: [
      { id: 'h1', date: '01 Mar 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
      { id: 'h2', date: '09 Mar 2026, 08:45', action: 'Reportado como Dañado', description: 'Golpe en esquina superior izquierda durante transporte', user: 'Claudia ', status: 'Dañado' },
    ]
  },
  {
    id: '6', nfcCode: 'NFC-006', type: 'Urna', description: 'Urna Bronce Clásico', material: 'Bronce fundido',
    model: 'Eternidad', supplier: 'Cofres Garza', size: 'Mediana',
    costPrice: 5200, salePrice: 8500, status: 'Reservado', branch: 'CEDIS Pino Suárez',
    lastUpdated: '10 Mar 2026, 13:00',
    history: [
      { id: 'h1', date: '20 Feb 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
      { id: 'h2', date: '10 Mar 2026, 13:00', action: 'Reservado', description: 'Apartado para contrato previsorio #CPR-441', user: 'Claudia ', status: 'Reservado' },
    ]
  },
  {
    id: '7', nfcCode: 'NFC-007', type: 'Ataúd', description: 'Ataúd Roble Premium', material: 'Madera de Roble Europeo',
    model: 'Grandeur', supplier: 'Artesanos del Norte', size: 'Grande',
    costPrice: 18000, salePrice: 28000, status: 'Vendido', branch: 'CEDIS Pino Suárez',
    lastUpdated: '05 Mar 2026, 17:00',
    history: [
      { id: 'h1', date: '01 Feb 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
      { id: 'h2', date: '05 Mar 2026, 17:00', action: 'Venta Definitiva', description: 'Vendido — Contrato USO INMEDIATO #CUI-089', user: 'Claudia ', status: 'Vendido' },
    ]
  },
  {
    id: '8', nfcCode: 'NFC-008', type: 'Ataúd', description: 'Ataúd Caoba Dorado', material: 'Madera de Caoba con Herrajes Dorados',
    model: 'Imperial Gold', supplier: 'Arte Funerario MX', size: 'Grande',
    costPrice: 26000, salePrice: 42000, status: 'En Renta', branch: 'CEDIS Pino Suárez',
    lastUpdated: '11 Mar 2026, 08:00',
    history: [
      { id: 'h1', date: '15 Feb 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
      { id: 'h2', date: '11 Mar 2026, 08:00', action: 'Salida — Renta Cremación', description: 'Servicio #SRV-120 · Cliente: Ana Martínez', user: 'Claudia ', status: 'En Renta' },
    ]
  },
  {
    id: '9', nfcCode: 'NFC-009', type: 'Urna', description: 'Urna Mármol Blanco', material: 'Mármol Natural',
    model: 'Mármol Serenidad', supplier: 'Arte Funerario MX', size: 'Mediana',
    costPrice: 9500, salePrice: 15000, status: 'Pendiente', branch: 'CEDIS Pino Suárez',
    lastUpdated: '11 Mar 2026, 10:00',
    history: [
      { id: 'h1', date: '11 Mar 2026, 10:00', action: 'Recibido — Pendiente de Revisión', description: 'Recepción con posible defecto de transporte, pendiente inspección', user: 'Claudia ', status: 'Pendiente' },
    ]
  },
  {
    id: '10', nfcCode: 'NFC-010', type: 'Ataúd', description: 'Ataúd Metálico Estándar', material: 'Acero 20 Calibre',
    model: 'Classic Steel', supplier: 'Cofres Garza', size: 'Mediano',
    costPrice: 14000, salePrice: 25000, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '06 Mar 2026, 15:00',
    history: [
      { id: 'h1', date: '01 Mar 2026, 10:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
    ]
  },
  {
    id: '11', nfcCode: 'NFC-011', type: 'Ataúd', description: 'Ataúd Pino Lacado', material: 'Madera de Pino con Laca',
    model: 'Sereno Lacado', supplier: 'Pino Suárez Funeraria', size: 'Mediano',
    costPrice: 8000, salePrice: 14000, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '04 Mar 2026, 12:00',
    history: [
      { id: 'h1', date: '04 Mar 2026, 12:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
    ]
  },
  {
    id: '12', nfcCode: 'NFC-012', type: 'Urna', description: 'Urna Nogal Oscuro', material: 'Madera de Nogal',
    model: 'Reposo Oscuro', supplier: 'Artesanos del Norte', size: 'Grande',
    costPrice: 4200, salePrice: 7000, status: 'Disponible', branch: 'CEDIS Pino Suárez',
    lastUpdated: '02 Mar 2026, 09:00',
    history: [
      { id: 'h1', date: '02 Mar 2026, 09:00', action: 'Alta en Sistema', description: 'Ingresado a inventario CEDIS', user: 'Claudia ', status: 'Disponible' },
    ]
  },
];

const CLIENTS: Client[] = [
  { id: '1',  name: 'María González Rodríguez',   phone: '55 1234 5678', contractType: 'Previsorio',    folio: 'CPR-0441', email: 'mgonzalez@email.com' },
  { id: '2',  name: 'Carlos Hernández López',      phone: '55 2345 6789', contractType: 'Uso Inmediato', folio: 'CUI-0112' },
  { id: '3',  name: 'Ana Patricia Martínez',       phone: '55 3456 7890', contractType: 'Previsorio',    folio: 'CPR-0398' },
  { id: '4',  name: 'Roberto Sánchez Torres',      phone: '55 4567 8901', contractType: 'Uso Inmediato', folio: 'CUI-0089' },
  { id: '5',  name: 'Elena Villanueva Cruz',        phone: '55 5678 9012', contractType: 'Previsorio',    folio: 'CPR-0512' },
  { id: '6',  name: 'Josefina Ramírez Morales',    phone: '55 6789 0123', contractType: 'Previsorio',    folio: 'CPR-0478' },
  { id: '7',  name: 'Francisco Medina García',     phone: '55 7890 1234', contractType: 'Uso Inmediato', folio: 'CUI-0134' },
  { id: '8',  name: 'Lupita Delgado Fuentes',      phone: '55 8901 2345', contractType: 'Previsorio',    folio: 'CPR-0355' },
  { id: '9',  name: 'Arturo Castillo Reyes',       phone: '55 9012 3456', contractType: 'Uso Inmediato', folio: 'CUI-0201' },
  { id: '10', name: 'Sofía Moreno Gutiérrez',      phone: '55 0123 4567', contractType: 'Previsorio',    folio: 'CPR-0289' },
  { id: '11', name: 'Miguel Ángel Flores Jiménez', phone: '55 1111 2222', contractType: 'Uso Inmediato', folio: 'CUI-0067' },
  { id: '12', name: 'Carmen López Vargas',         phone: '55 2222 3333', contractType: 'Previsorio',    folio: 'CPR-0601' },
  { id: '13', name: 'José Luis Ruiz Paredes',      phone: '55 3333 4444', contractType: 'Uso Inmediato', folio: 'CUI-0188' },
  { id: '14', name: 'Patricia Fuentes Méndez',     phone: '55 4444 5555', contractType: 'Previsorio',    folio: 'CPR-0712' },
  { id: '15', name: 'Alejandro Torres Bravo',      phone: '55 5555 6666', contractType: 'Uso Inmediato', folio: 'CUI-0044' },
];

function mkItems(cat: EquipmentGroup['category'], prefix: string, total: number, inSvc: number): any[] {
  return Array.from({ length: total }, (_, i) => ({
    id: `${prefix}-${String(i+1).padStart(3,'0')}`,
    code: `${prefix}-${String(i+1).padStart(3,'0')}`,
    category: cat,
    status: i < inSvc ? 'En Servicio' : 'Disponible',
  }));
}

const EQUIPMENT_GROUPS: EquipmentGroup[] = [
  { category: 'Biombos',   icon: '🏮', total: 10, inService: 3,  available: 7,  lastExit: '10 Mar 2026', items: mkItems('Biombos',   'BIO', 10, 3) },
  { category: 'Torcheros', icon: '🕯️', total: 20, inService: 8,  available: 12, lastExit: '09 Mar 2026', items: mkItems('Torcheros', 'TOR', 20, 8) },
  { category: 'Trípies',   icon: '📸', total: 15, inService: 5,  available: 10, lastExit: '11 Mar 2026', items: mkItems('Trípies',   'TRI', 15, 5) },
  { category: 'Sillas',    icon: '🪑', total: 60, inService: 24, available: 36, lastExit: '11 Mar 2026', items: mkItems('Sillas',    'SIL', 60, 24) },
  { category: 'Toldos',    icon: '⛺', total: 8,  inService: 2,  available: 6,  lastExit: '08 Mar 2026', items: mkItems('Toldos',    'TOL', 8, 2) },
];

const ALERTS: Alert[] = [
  { id: 'a1', type: 'warning', message: 'Stock bajo: Urnas Cerámica',        detail: 'Quedan 2 unidades disponibles de Urna Cerámica Blanca',           timestamp: '11 Mar, 09:30', read: false },
  { id: 'a2', type: 'error',   message: 'Producto dañado reportado',         detail: 'NFC-005 Ataúd Pino Natural — golpe en esquina durante transporte', timestamp: '09 Mar, 08:45', read: false },
  { id: 'a3', type: 'info',    message: 'Renta próxima a vencer',            detail: 'NFC-002 retorno esperado 12 Mar 2026 — Servicio SRV-118',          timestamp: '09 Mar, 10:00', read: false },
  { id: 'a4', type: 'success', message: 'Entrada registrada exitosamente',   detail: '3 ataúdes recibidos de Artesanos del Norte — Orden ORD-0089',     timestamp: '08 Mar, 14:20', read: true  },
  { id: 'a5', type: 'warning', message: 'Equipo sin devolver: Sillas x24',  detail: 'Servicio SRV-115 sin confirmar devolución de sillas',             timestamp: '07 Mar, 17:00', read: true  },
  { id: 'a6', type: 'info',    message: 'Orden de compra pendiente',         detail: 'OC-0078 de Cofres Garza — aprobación requerida CEO',              timestamp: '06 Mar, 11:00', read: true  },
  { id: 'a7', type: 'warning', message: 'NFC-009 pendiente de revisión',     detail: 'Urna Mármol Blanco recibida con posible defecto de transporte',   timestamp: '11 Mar, 10:00', read: false },
];
