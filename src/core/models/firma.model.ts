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

export interface FirmaDto {
  nazwa: string;
  nip: string;
  regon: string;
  krs: string;
  adresDzialalnosci: AdresDto;
  adresKorespondencyjny: AdresDto;
  pkdGlowny: Pkd;
  pkd: Pkd[];
  dataRozpoczecia: string;
  dataZawieszenia?: string;
  dataZakonczenia?: string;
  status: BusinessStatus;
  telefon?: string;
  email?: string;
  www?: string;
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
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
