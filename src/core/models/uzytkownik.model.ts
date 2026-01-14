export interface ParametrySubscrypcjiDto {
  uuid: string;
  version: number;
  pkd: string;
  dataRozpoczeciaOd: string;
  dataRozpoczeciaDo: string;
  wojewodztwo: string;
  powiat: string;
  gmina: string;
}

export interface FirmaSubscrypcjaDto {
  nazwa: string;
  opis: string;
  iloscDostepnychFirm: number;
  aktywnaOd: string;
  aktywnaDo: string;
  parametrySubscrypcji: ParametrySubscrypcjiDto | null;
}

export interface Uzytkownik {
  uuid: string;
  version: number;
  email: string;
  podmiotGospodarczyUuid: string;
  nazwaFirmy: string;
  nip: string;
  czyEmailPotwierdzony: boolean;
  aktywnaSubscrypcja: FirmaSubscrypcjaDto | null;
}
