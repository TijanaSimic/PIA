import { Component, OnInit } from '@angular/core';
import { ServisService } from '../servis.service';
import { Proizvod } from '../models/proizvod';
import { Komentar } from '../models/komentar';
import { Ocena } from '../models/ocena';
import { Router } from '@angular/router';
import { StringifyOptions } from 'querystring';

@Component({
  selector: 'app-detalji-proizvoda',
  templateUrl: './detalji-proizvoda.component.html',
  styleUrls: ['./detalji-proizvoda.component.css']
})
export class DetaljiProizvodaComponent implements OnInit {

  constructor(private servis: ServisService, private router:Router) { }

  komentari: Komentar[] = [];
  ocene: Ocena[] = [];
  proizvod: Proizvod;
  prosecnaOcena: number = 0;
  loggedUser: string;

  ngOnInit(): void {
   
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.proizvod = JSON.parse(localStorage.getItem('proizvod-detalji'));
    this.servis.dohvatiKomentare(this.proizvod.preduzece, this.proizvod.nazivProizvoda).subscribe(data => {
      this.komentari = data;
    })
  
    if(this.loggedUser==this.proizvod.preduzece) this.flagZaDodavanje=0
    else this.flagZaDodavanje=1
    this.servis.dohvatiOcene(this.proizvod.preduzece, this.proizvod.nazivProizvoda).subscribe(data => {
      this.ocene = data;

      this.ocene.forEach(ocena => {
        this.prosecnaOcena += ocena.vrednost
      })
      this.prosecnaOcena /= this.ocene.length;
      
      if(isNaN(this.prosecnaOcena)) this.prosecnaOcena=0
     
    })
  }

  tekst: string;

  flagZaDodavanje:number=0;

  logOut() {
    localStorage.removeItem('loggedUser');
   this.router.navigate(['/login']) 
  }

  mess:string="";
  dodajKomentar() {

    this.mess=""
  //  if(this.loggedUser==this.proizvod.preduzece) this.flagZaDodavanje=1
    this.servis.komentariPoljoprivrednika(this.proizvod.nazivProizvoda,
      this.proizvod.preduzece, this.loggedUser).subscribe(data => {
        if (!data) {
         
          this.servis.narudzbinePoljoprivrednika(this.proizvod.nazivProizvoda,
            this.proizvod.preduzece, this.loggedUser).subscribe(data1 => {
              if (data1) {
                this.servis.dodajKomentar(this.tekst, this.proizvod.nazivProizvoda, this.proizvod.preduzece, this.loggedUser).
                  subscribe(data => {
                    this.komentari.push(data);
                  }
                  )
              }
              else {
                this.mess="Niste narucivali ovaj proizvod."
              }
             
            })
        }

 else {
                this.mess="Dozvoljen je samo jedan komentar.";
              }

      })
  }

  ocena: number;

  dodajOcenu() {
   this.mess=""
    this.servis.ocenePoljoprivrednika(this.proizvod.nazivProizvoda,
      this.proizvod.preduzece, this.loggedUser).subscribe(data => {
      //  console.log('data je',data)
        if (!data) {
       //   console.log('idem u narudzbine')
          this.servis.narudzbinePoljoprivrednika(this.proizvod.nazivProizvoda,
            this.proizvod.preduzece, this.loggedUser).subscribe(data1 => {
              if (data1) {
                this.servis.dodajOcenu(this.ocena, this.proizvod.nazivProizvoda, this.proizvod.preduzece, this.loggedUser).
                  subscribe(data => {
                    this.ocene.push(data);
                  }
                  )
              }  
              else {
                this.mess="Niste naručivali ovaj proizvod."
              }
            })
        }
else {
                this.mess="Dozvoljena je samo jedna ocena.";
              }

      })
  }

pocetna() {
  if(this.flagZaDodavanje==0) 
  this.router.navigate(['/preduzece']);
  else this.router.navigate(['/poljoprivrednik'])
}

}
