import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirmaCrmSzczegoly, StatusKontaktu, StatusKontaktuLabels, SposobKontaktu, SposobKontaktuLabels, AktualizujSzczegolyKontaktuDto } from '../../core/models/firma.model';
import { ApiService } from '../../core/services/api.service';
import { log } from 'console';

@Component({
  selector: 'app-firma-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './firma-details.component.html',
  styleUrls: ['./firma-details.component.scss']
})
export class FirmaDetailsComponent {
  @Input() firma: FirmaCrmSzczegoly | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() firmaUpdated = new EventEmitter<FirmaCrmSzczegoly>();

  statusKontaktuOptions = Object.values(StatusKontaktu);
  statusKontaktuLabels = StatusKontaktuLabels;
  sposobKontaktuOptions = Object.values(SposobKontaktu);
  sposobKontaktuLabels = SposobKontaktuLabels;
  StatusKontaktu = StatusKontaktu; // Make enum available in template
  isEditing: boolean = false;
  isSaving: boolean = false;
  editedFirma: FirmaCrmSzczegoly | null = null;

  constructor(private apiService: ApiService) {}

  onClose(): void {
    this.isEditing = false;
    this.editedFirma = null;
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onEdit(): void {
    if (this.firma) {
      this.editedFirma = { ...this.firma };
      this.isEditing = true;
    }
  }

  onCancel(): void {
    this.isEditing = false;
    this.editedFirma = null;
  }

  onSave(): void {
    if (this.editedFirma && this.firma) {
      // Validate required fields
      if (!this.editedFirma.statusKontaktu || !this.editedFirma.sposobKontaktu || !this.editedFirma.dataOstatniegoKontaktu) {
        console.error('Required fields are missing');
        return;
      }

      const dto: AktualizujSzczegolyKontaktuDto = {
        uuid: this.editedFirma.uuid,
        version: this.editedFirma.version,
        statusKontaktu: this.editedFirma.statusKontaktu,
        sposobKontaktu: this.editedFirma.sposobKontaktu,
        dataOstatniegoKontaktu: this.editedFirma.dataOstatniegoKontaktu,
        dataNastepnegoKontaktu: this.editedFirma.dataNastepnegoKontaktu,
        komentarz: this.editedFirma.komentarz
      };

      this.isSaving = true;
      this.apiService.put<FirmaCrmSzczegoly>('firmy/kontakt', dto)
        .subscribe({
          next: (updated) => {
            this.firma = updated;
            this.firmaUpdated.emit(updated);
            this.isEditing = false;
            this.editedFirma = null;
            this.isSaving = false;
          },
          error: (error) => {
            console.error('Error updating firma:', error);
            this.isSaving = false;
          }
        });
    }
  }

  getStatusLabel(status: StatusKontaktu | string | undefined): string {
    if (!status) return '-';
    return StatusKontaktuLabels[status as StatusKontaktu] || status;
  }

  getSposobKontaktuLabel(sposob: SposobKontaktu | string | undefined): string {
    if (!sposob) return '-';
    return SposobKontaktuLabels[sposob as SposobKontaktu] || sposob;
  }

  shouldShowSposobKontaktu(statusKontaktu: StatusKontaktu | undefined): boolean {
    return statusKontaktu !== undefined && 
           statusKontaktu !== null && 
           statusKontaktu !== StatusKontaktu.DO_KONTAKTU;
  }

  shouldShowDataNastepnegoKontaktu(statusKontaktu: StatusKontaktu | undefined): boolean {
    return statusKontaktu === StatusKontaktu.BRAK_ODPOWIEDZI;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pl-PL');
  }
}
