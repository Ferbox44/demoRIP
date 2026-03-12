import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-configuracion',
  imports: [],
  template: `
    <div class="page-wrapper">
      <div class="page-content" style="max-width:800px">
        <h1 class="page-title" style="margin-bottom:24px">Configuración del Sistema</h1>
        <div class="card" style="margin-bottom:20px">
          <div class="card-title" style="margin-bottom:16px">⚙️ General</div>
          <div class="config-row"><span>Nombre del sistema</span><strong>Inventario Funeraria</strong></div>
          <div class="config-row"><span>Versión</span><strong>v1.0 — Prototipo</strong></div>
          <div class="config-row"><span>Sucursal activa</span><strong>CEDIS Pino Suárez</strong></div>
          <div class="config-row"><span>Usuario actual</span><strong>{{ auth.currentUser()?.name }}</strong></div>
          <div class="config-row"><span>Rol</span><strong>{{ auth.currentUser()?.roleLabel }}</strong></div>
        </div>
        <div class="card" style="margin-bottom:20px">
          <div class="card-title" style="margin-bottom:16px">🏢 Sucursales</div>
          <p class="text-secondary text-sm">Gestión multisucursal disponible en la versión completa.</p>
          <p class="text-muted text-xs" style="margin-top:8px">Actualmente operando solo con CEDIS Pino Suárez.</p>
        </div>
        <div class="card">
          <div class="card-title" style="margin-bottom:16px">🔔 Alertas y Notificaciones</div>
          <p class="text-secondary text-sm">Configuración de umbrales de alertas de stock y vencimientos de renta.</p>
        </div>
      </div>
    </div>
  `,
  styles: ['.config-row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--border-light); font-size:13px; } .config-row:last-child { border-bottom:none; } .config-row span { color:var(--text-secondary); }']
})
export class ConfiguracionComponent {
  auth = inject(AuthService);
}
