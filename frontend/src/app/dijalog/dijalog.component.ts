import { Component, OnInit } from '@angular/core';
import { Sadnica } from '../models/sadnica';
import { ServisService } from '../servis.service';
import { Magacin } from '../models/magacin';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dijalog',
  templateUrl: './dijalog.component.html',
  styleUrls: ['./dijalog.component.css']
})
export class DijalogComponent implements OnInit {

  constructor(private servis: ServisService, private router: Router, public dialogRef: MatDialogRef<DijalogComponent>,) { }

  sadnica: Sadnica = {
    _id: null,
    naziv: null,
    proizvodjac: null,
    napredovanje: null,
    ukupanBrojDana: null,
    datumSadjenja: null,
    poljoprivrednik: null,
    idRasadnika: null,
    flagZaPorukuNaDijalogu: null

  };

  id: string = ""
  napredak: number = 0;
  idRasadnika: string = ""
  preparati: Magacin[] = []
  selektovanPreparat: number;
  message: string = ""
  flagZaVadjenje: number = 0;
  sadniceMagacin: Magacin[] = []

  ngOnInit(): void {

    this.sadnica = JSON.parse(localStorage.getItem('sadnica'));

    if (this.sadnica) {
       this.flagZaVadjenje = this.sadnica.flagZaPorukuNaDijalogu

    //   console.log("FLAG JEE", this.sadnica.flagZaPorukuNaDijalogu)

 

      this.idRasadnika = this.sadnica.idRasadnika
      if (this.sadnica.napredovanje == 0 && this.flagZaVadjenje == 0) {

        this.napredak = (new Date().getTime() - (new Date(this.sadnica.datumSadjenja)).getTime()) * 100 / (this.sadnica.ukupanBrojDana * 24 * 60 * 60 * 1000)
     //   console.log("napredak kad je napredovanje 0", this.napredak);

      } else if (this.sadnica.napredovanje != 0 && this.flagZaVadjenje == 0) {
      //  console.log("napredak kad je napredovanje 0", this.napredak);

        this.napredak = (this.sadnica.napredovanje * 24 * 60 * 60 * 1000 + new Date().getTime() - (new Date(this.sadnica.datumSadjenja)).getTime()) * 100 / (this.sadnica.ukupanBrojDana * 24 * 60 * 60 * 1000)
      //  console.log("napredak kad je napredovanje !0", this.napredak);


      }
      else {
     

        this.napredak = 100
      }

      if (this.napredak >= 100) {
        this.napredak = 100;
        this.message = "Sadnica je spremna za vadjenje."
          if (this.flagZaVadjenje != 2) {
          this.flagZaVadjenje = 1
          this.servis.azurirajSadnicuPoruka(this.sadnica._id, 1).subscribe();
        }
       }



      this.servis.dohvatiPreparate(this.idRasadnika).subscribe((data: Magacin[]) => {
        this.preparati = data

      })
    }
    else {
      this.idRasadnika = JSON.parse(localStorage.getItem('rasadnik'))
      this.servis.dohvatiSadniceIzMagacina(this.idRasadnika).subscribe((data: Magacin[]) => {
        this.sadniceMagacin = data

      })
    }
  }

  primeni() {


    let selektovanPreparat: number = (Number)(this.selektovanPreparat)
    let dodati: number = 0;
    if (this.preparati.length > 0) {
      dodati = this.preparati[selektovanPreparat].uputstvo;

      this.servis.azurirajSadnicuNapredovanje(this.sadnica._id, dodati).subscribe((data: Sadnica) => {
        this.sadnica = data
        this.napredak = (this.sadnica.napredovanje * 24 * 60 * 60 * 1000 + new Date().getTime() - (new Date(this.sadnica.datumSadjenja)).getTime()) * 100 / (this.sadnica.ukupanBrojDana * 24 * 60 * 60 * 1000)
      
        if (this.preparati[selektovanPreparat].kolicina > 1)
          this.servis.azurirajPreparatKolicina(this.preparati[selektovanPreparat]._id, -1).subscribe((data: Magacin[]) => {
            this.servis.dohvatiPreparate(this.idRasadnika).subscribe((data: Magacin[]) => {
              this.preparati = data

            })
          })
        else {
          this.servis.obrisiIzMagacina(this.preparati[selektovanPreparat]._id).subscribe()
        }
        window.location.href = window.location.href

      }
      )
    }
  }


  //flag se stavlja na 2 u vadjenju


  izvadi() {
      this.flagZaVadjenje=2;
      this.servis.azurirajSadnicuPoruka(this.sadnica._id, 2).subscribe();

    let objekat = [this.sadnica._id, new Date().getTime(), 24 * 60 * 60 * 1000/*10000*/]
    localStorage.setItem(`${this.sadnica._id}`, JSON.stringify(objekat));
  
    setTimeout(() => {
      this.servis.obrisiIzSadnica(this.sadnica._id).subscribe(data => {
        this.sadnica = null
        window.location.href = window.location.href
      }
      )



    }, 24 * 60 * 60 * 1000/*10000*/)
    window.location.href = window.location.href

  }
  selektovanaSadnica: number;

  zasadi() {

    let selektovanaSadnica: number = (Number)(this.selektovanaSadnica)
    let sadnicaIzMagacina = this.sadniceMagacin[selektovanaSadnica];
    this.flagZaVadjenje = 0;
    let s = {
      naziv: sadnicaIzMagacina.nazivProizvoda,
      proizvodjac: sadnicaIzMagacina.proizvodjac,
      ukupanBrojDana: sadnicaIzMagacina.ukupanBrojDana,
      poljoprivrednik: JSON.parse(localStorage.getItem('loggedUser')),
      idRasadnika: this.idRasadnika,
      flagZaPorukuNaDijalogu: 0

    }
    this.servis.dodajSadnicu(s).subscribe(data => {
   //   console.log(' pri dodavanju date je', data)

    
      if (sadnicaIzMagacina.kolicina > 1)
        this.servis.azurirajPreparatKolicina(sadnicaIzMagacina._id, -1).subscribe()
      else {
        this.servis.obrisiIzMagacina(sadnicaIzMagacina._id).subscribe()
      }
    })
    window.location.href = window.location.href
  }


  onNoClick(): void {


    this.dialogRef.close();

  }

}
