import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenants-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Inquilinos</h1>
      <p>Lista de inquilinos em desenvolvimento...</p>
    </div>
  `
})
export class TenantsListComponent { }
