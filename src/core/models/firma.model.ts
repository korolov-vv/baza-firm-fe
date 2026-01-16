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
  uuid: string;
  nazwa: string;
  nip: string;
  wojewodztwo?: string;
  pkdGlowny: Pkd;
  telefon?: string;
  email?: string;
  statusKontaktu?: string;
  dataOstatniegoKontaktu?: string;
  komentarz?: string;
}

export interface FirmaCrmSzczegoly {
  version: number;
  uuid: string;
  nazwa: string;
  nip?: string;
  regon?: string;
  adresKorespondencyjny?: string;
  adresDzialalnosci?: string;
  pkdGlowny?: string;
  pozostalePkd?: string;
  telefon?: string;
  email?: string;
  stronaWww?: string;
  statusKontaktu?: string;
  sposobKontaktu?: string;
  dataOstatniegoKontaktu?: string;
  dataNastepnegoKontaktu?: string;
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
