export interface Narudzbina {
    _id:string;
    nazivProizvoda:string;
    preduzece:string;
    mestoPreduzeca:string;
    datumNarucivanja:Date; 
    mestoRasadnika:string;
    status:string;
    poljoprivrednik:string;
    kolicina:number;
    nazivRasadnika:string;
    identifikatorPorudzbine:number;
    uputstvo:number;
    ukupanBrojDana:number;
    vrstaProizvoda:number //u dodavanje narudzbine staviti i vrstu a obrisati polje posalta
}