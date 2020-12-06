export interface Proizvod  {
    _id:string;
    nazivProizvoda:string;
    preduzece:string;
    mestoPreduzeca:string
    kolicina:number;
    cenaPoKomadu:number;
    vrsta:number; //0-sadnica 1-preparat
    uputstvo:number; //0 ako je sadnica, sve ostalo ako je preparat 
    //mogla bih ovo koristiti uputstvo za ukupan br dana
    ukupanBrojDana:number;

}