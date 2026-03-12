import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <div class="layout-main">
      <router-outlet />
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    .layout-main { flex: 1; background: var(--bg); }
  `]
})
export class LayoutComponent {}
