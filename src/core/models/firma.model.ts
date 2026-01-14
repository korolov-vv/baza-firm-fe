export interface AdresDto {
  ulica?: string;
  numerBudynku?: string;
  numerLokalu?: string;
  kodPocztowy?: string;
  miejscowosc?: string;
  gmina?: string;
  powiat?: string;
  wojewodztwo?: string;
}

export interface Pkd {
  kod?: string;
  nazwa?: string;
}

export enum BusinessStatus {
  AKTYWNA = 'AKTYWNA',
  ZAWIESZONA = 'ZAWIESZONA',
  ZAKONCZONA = 'ZAKONCZONA'
}

export interface FirmaListDto {
  nazwa: string;
  nip: string;
  pkdGlowny: Pkd;
  telefon?: string;
  email?: string;
  www?: string;
  statusKontaktu?: string;
  dataOstatniegoKontaktu?: string;
  komentarz?: string;
}

export interface FirmaSearchParams {
  nazwa?: string;
  pkd?: string;
  dataRozpoczeciaOd?: string;
  dataRozpoczeciaDo?: string;
  wojewodztwo?: string;
  powiat?: string;
  gmina?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
