import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirmaListDto } from '../../core/models/firma.model';

@Component({
  selector: 'app-firma-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './firma-table.component.html',
  styleUrls: ['./firma-table.component.scss']
})
export class FirmaTableComponent {
  @Input() firmy: FirmaListDto[] = [];
  @Input() isLoading: boolean = false;
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() availablePageSizes: number[] = [10, 25, 50];
  
  @Output() rowDoubleClick = new EventEmitter<FirmaListDto>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  Math = Math;

  onRowDoubleClick(firma: FirmaListDto): void {
    this.rowDoubleClick.emit(firma);
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  getStatusKontaktuLabel(status: string | undefined): string {
    if (!status) return '-';
    
    const labels: { [key: string]: string } = {
      'NOWY': 'Nowy',
      'W_TRAKCIE': 'W trakcie',
      'ZAINTERESOWANY': 'Zainteresowany',
      'NIE_ZAINTERESOWANY': 'Nie zainteresowany',
      'UMAWIANY': 'Umawiany',
      'KLIENT': 'Klient'
    };
    
    return labels[status as string] || status;
  }
}
