export interface Magacin {
    _id:string;
    nazivProizvoda:string;
    proizvodjac:string;
    kolicina:number;
    idRasadnika:string;
    vrsta:number //0-sadnica 1-preparat
    uputstvo:number; //o ako je sadnica, sve ostalo ako je preparat
    ukupanBrojDana:number; 
}