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

export enum StatusKontaktu {
  DO_KONTAKTU = 'DO_KONTAKTU',
  BRAK_ODPOWIEDZI = 'BRAK_ODPOWIEDZI',
  ZAPLANOWANO_NASTEPNY_KONTAKT = 'ZAPLANOWANO_NASTEPNY_KONTAKT',
  PRZEKAZANO_DO_DALSZEJ_OBSLUGI = 'PRZEKAZANO_DO_DALSZEJ_OBSLUGI'
}

export const StatusKontaktuLabels: Record<StatusKontaktu, string> = {
  [StatusKontaktu.DO_KONTAKTU]: 'Do kontaktu',
  [StatusKontaktu.BRAK_ODPOWIEDZI]: 'Brak odpowiedzi - zaplanowano następny kontakt',
  [StatusKontaktu.ZAPLANOWANO_NASTEPNY_KONTAKT]: 'Zaplanowano następny kontakt',
  [StatusKontaktu.PRZEKAZANO_DO_DALSZEJ_OBSLUGI]: 'Przekazano do dalszej obsługi'
};

export enum SposobKontaktu {
  KONTAKT_TELEFONICZNY = 'KONTAKT_TELEFONICZNY',
  KONTAKT_MAILOWY = 'KONTAKT_MAILOWY',
  LIST_TRADYCYJNY = 'LIST_TRADYCYJNY',
  PRZEDSTAWICIEL_HANDLOWYK = 'PRZEDSTAWICIEL_HANDLOWYK'
}

export const SposobKontaktuLabels: Record<SposobKontaktu, string> = {
  [SposobKontaktu.KONTAKT_TELEFONICZNY]: 'Kontakt telefoniczny',
  [SposobKontaktu.KONTAKT_MAILOWY]: 'Kontakt mailowy',
  [SposobKontaktu.LIST_TRADYCYJNY]: 'List tradycyjny',
  [SposobKontaktu.PRZEDSTAWICIEL_HANDLOWYK]: 'Przedstawiciel handlowy'
};

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
  statusKontaktu?: StatusKontaktu;
  sposobKontaktu?: SposobKontaktu;
  dataOstatniegoKontaktu?: string;
  dataNastepnegoKontaktu?: string;
  komentarz?: string;
}

export interface AktualizujSzczegolyKontaktuDto {
  uuid: string;
  version: number;
  statusKontaktu: StatusKontaktu;
  sposobKontaktu: SposobKontaktu;
  dataOstatniegoKontaktu: string;
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
