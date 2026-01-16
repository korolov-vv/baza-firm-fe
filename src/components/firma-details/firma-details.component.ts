import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaCrmSzczegoly } from '../../core/models/firma.model';

@Component({
  selector: 'app-firma-details',
  imports: [CommonModule],
  templateUrl: './firma-details.component.html',
  styleUrls: ['./firma-details.component.scss']
})
export class FirmaDetailsComponent {
  @Input() firma: FirmaCrmSzczegoly | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pl-PL');
  }
}
