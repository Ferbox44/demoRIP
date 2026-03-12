export type UserRole = 'CEO' | 'Gerente' | 'EncInventario' | 'Contabilidad';
export type ProductStatus = 'Disponible' | 'Dañado' | 'En Renta' | 'Pendiente' | 'Reservado' | 'Vendido';
export type ProductType = 'Ataúd' | 'Urna' | 'Equipo';
export type ContractType = 'Previsorio' | 'Uso Inmediato';
export type EquipmentCategory = 'Biombos' | 'Torcheros' | 'Trípies' | 'Sillas' | 'Toldos';

export interface Account {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  branch?: string;
  roleLabel: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  branch?: string;
}

export interface Product {
  id: string;
  nfcCode: string;
  type: ProductType;
  description: string;
  material: string;
  model: string;
  supplier: string;
  size: string;
  costPrice: number;
  salePrice: number;
  status: ProductStatus;
  branch: string;
  lastUpdated: string;
  history: ProductEvent[];
  photos?: string[];
}

export interface ProductEvent {
  id: string;
  date: string;
  action: string;
  description: string;
  user: string;
  status: ProductStatus;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  contractType: ContractType;
  email?: string;
  folio?: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  category: EquipmentCategory;
  status: 'Disponible' | 'En Servicio';
}

export interface EquipmentGroup {
  category: EquipmentCategory;
  icon: string;
  total: number;
  inService: number;
  available: number;
  lastExit: string;
  items: EquipmentItem[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  detail: string;
  timestamp: string;
  read: boolean;
  productId?: string;
}

export interface NavItem {
  label: string;
  route: string;
  badge?: number;
  movimientosGroup?: boolean;
}

export interface KPI {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  currency?: boolean;
}
