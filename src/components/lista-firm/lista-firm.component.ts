import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaFirmAllComponent } from '../lista-firm-all/lista-firm-all.component';
import { ListaFirmTodayComponent } from '../lista-firm-today/lista-firm-today.component';
import { FirmaCrmSzczegoly } from '../../core/models/firma.model';

@Component({
  selector: 'app-lista-firm',
  standalone: true,
  imports: [CommonModule, ListaFirmAllComponent, ListaFirmTodayComponent],
  templateUrl: './lista-firm.component.html',
  styleUrls: ['./lista-firm.component.scss']
})
export class ListaFirmComponent {
  activeTab: 'all' | 'today' = 'today';

  onTabChange(tab: 'all' | 'today'): void {
    this.activeTab = tab;
  }

  onFirmaUpdated(updatedFirma: FirmaCrmSzczegoly): void {
    // Handle global updates if needed across both tabs
  }

}