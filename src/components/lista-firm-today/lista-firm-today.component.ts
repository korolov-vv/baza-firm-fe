import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { FirmaListDto, PageableResponse, FirmaCrmSzczegoly } from '../../core/models/firma.model';
import { FirmaTableComponent } from '../firma-table/firma-table.component';
import { FirmaDetailsComponent } from '../firma-details/firma-details.component';

@Component({
  selector: 'app-lista-firm-today',
  standalone: true,
  imports: [CommonModule, FirmaTableComponent, FirmaDetailsComponent],
  templateUrl: './lista-firm-today.component.html',
  styleUrls: ['./lista-firm-today.component.scss']
})
export class ListaFirmTodayComponent implements OnInit {
  firmy: FirmaListDto[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  availablePageSizes: number[] = [10, 25, 50];

  // Modal state
  isModalOpen: boolean = false;
  selectedFirma: FirmaCrmSzczegoly | null = null;
  isLoadingDetails: boolean = false;

  @Output() firmaUpdated = new EventEmitter<FirmaCrmSzczegoly>();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.waitForInit();
    if (this.authService.isAuthenticated) {
      this.loadFirmy();
    } else {
      console.log('User not authenticated, skipping data load');
    }
  }

  loadFirmy(): void {
    this.isLoading = true;

    let params = new HttpParams();
    params = params.set('page', this.currentPage?.toString() || '0');
    params = params.set('size', this.pageSize?.toString() || '10');

    this.apiService.get<PageableResponse<FirmaListDto>>('v1/firmy/do-kontaktu-dzis', params)
      .subscribe({
        next: (response) => {
          this.firmy = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.currentPage = response.pageNumber;
          this.pageSize = response.pageSize;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading today\'s contact firms:', error);
          this.firmy = [];
          this.totalElements = 0;
          this.totalPages = 0;
          this.isLoading = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFirmy();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadFirmy();
  }

  onRowDoubleClick(firma: FirmaListDto): void {
    this.loadFirmaDetails(firma.uuid);
  }

  loadFirmaDetails(uuid: string): void {
    this.isLoadingDetails = true;
    this.apiService.get<FirmaCrmSzczegoly>(`v1/firmy/${uuid}`)
      .subscribe({
        next: (details) => {
          this.selectedFirma = details;
          this.isModalOpen = true;
          this.isLoadingDetails = false;
        },
        error: (error) => {
          console.error('Error loading firma details:', error);
          this.isLoadingDetails = false;
        }
      });
  }

  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedFirma = null;
  }

  onFirmaUpdatedFromModal(updatedFirma: FirmaCrmSzczegoly): void {
    const index = this.firmy.findIndex(f => f.uuid === updatedFirma.uuid);
    if (index !== -1) {
      this.firmy[index] = {
        ...this.firmy[index],
        statusKontaktu: updatedFirma.statusKontaktu,
        dataOstatniegoKontaktu: updatedFirma.dataOstatniegoKontaktu,
        komentarz: updatedFirma.komentarz
      };
    }
    this.firmaUpdated.emit(updatedFirma);
  }
}
