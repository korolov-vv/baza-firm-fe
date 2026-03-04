import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { FirmaListDto, FirmaSearchParams, PageableResponse, FirmaCrmSzczegoly } from '../../core/models/firma.model';
import { FirmaTableComponent } from '../firma-table/firma-table.component';
import { FirmaDetailsComponent } from '../firma-details/firma-details.component';

@Component({
  selector: 'app-lista-firm-all',
  standalone: true,
  imports: [CommonModule, FirmaTableComponent, FirmaDetailsComponent],
  templateUrl: './lista-firm-all.component.html',
  styleUrls: ['./lista-firm-all.component.scss']
})
export class ListaFirmAllComponent implements OnInit {
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

  searchParams: FirmaSearchParams = {
    page: 0,
    size: 10
  };

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

    if (this.searchParams.nazwa) {
      params = params.set('nazwa', this.searchParams.nazwa);
    }
    if (this.searchParams.pkd) {
      params = params.set('pkd', this.searchParams.pkd);
    }
    if (this.searchParams.dataRozpoczeciaOd) {
      params = params.set('dataRozpoczeciaOd', this.searchParams.dataRozpoczeciaOd);
    }
    if (this.searchParams.dataRozpoczeciaDo) {
      params = params.set('dataRozpoczeciaDo', this.searchParams.dataRozpoczeciaDo);
    }
    if (this.searchParams.wojewodztwo) {
      params = params.set('wojewodztwo', this.searchParams.wojewodztwo);
    }
    if (this.searchParams.powiat) {
      params = params.set('powiat', this.searchParams.powiat);
    }
    if (this.searchParams.gmina) {
      params = params.set('gmina', this.searchParams.gmina);
    }

    params = params.set('page', this.searchParams.page?.toString() || '0');
    params = params.set('size', this.searchParams.size?.toString() || '10');

    if (this.searchParams.sort) {
      params = params.set('sort', this.searchParams.sort);
    }

    this.apiService.get<PageableResponse<FirmaListDto>>('v1/firmy', params)
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
          console.error('Error loading firmy:', error);
          this.isLoading = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.searchParams.page = page;
    this.loadFirmy();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.searchParams.size = size;
    this.searchParams.page = 0;
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
