import { Component, OnInit } from '@angular/core';
import { ServisService } from '../servis.service';
import { Proizvod } from '../models/proizvod';
import { Router } from '@angular/router';
import { Poljoprivrednik } from '../models/poljoprivrednik';
import { Narudzbina } from '../models/narudzbina';
import { Preduzece } from '../models/preduzece';


@Component({
  selector: 'app-prodavnica',
  templateUrl: './prodavnica.component.html',
  styleUrls: ['./prodavnica.component.css']
})
export class ProdavnicaComponent implements OnInit {
  
  constructor(private servis: ServisService, private router: Router) { }

  korpa: Porudzbina[] = []
  korpa1: Porudzbina[] = []
  loggedUser: string = "";
  ulogovaniPoljoprivrednik: Poljoprivrednik;
  proizvodi: ProizvodKorpa[] = [];

  index: number = 0;
  noviindex: number = 0;

  svaPreduzeca: Preduzece[] = []

  flagZaFormu: boolean = true;

  ngOnInit(): void {

    this.servis.preduzeca().subscribe(data => this.svaPreduzeca = data)

    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser')); 
    this.noviindex = JSON.parse(localStorage.getItem(`${this.loggedUser}identifikator`))
 

    this.servis.pretragaPoljUsername(this.loggedUser).subscribe(data => this.ulogovaniPoljoprivrednik = data)
    this.servis.sviProizvodi().subscribe(data => this.proizvodi = data);
  }

  detalji(p: Proizvod) {
    localStorage.setItem(`proizvod-detalji`, JSON.stringify(p));
    this.router.navigate(['/detalji']);
  } 
  flagZaProizvode: number = 0;



  mess = "";
  mestoRasadnika: string;
  nazivRasadnika: string;
  trenutneNarudzbine: Narudzbina[] = [];

  postojecaNarudzbina: Narudzbina;

  kupi() {
    this.mess = ""
    if (!this.nazivRasadnika || !this.mestoRasadnika) {
      this.mess = "Unesite sva polja za rasadnik."
      return;
    }
    this.flagZaFormu = false;

 

    this.message = ""
    this.proizvodi.forEach(pr => {

      if (pr.cekirano) {
        this.servis.pretragaPredUsername(pr.preduzece).subscribe(data => {

          if (data) {
            if (pr.kolicina >= pr.kolicinaZaKupovinu) {
              if (this.mestoRasadnika && this.nazivRasadnika) {

                pr.kolicina -= pr.kolicinaZaKupovinu

                let novopreduzece = null;
                let noviidentifikator = null
                this.trenutneNarudzbine.filter(el => {
                  if (el.preduzece == pr.preduzece) {
                    novopreduzece = el.preduzece
                    noviidentifikator = el.identifikatorPorudzbine
                    if (el.nazivProizvoda == pr.nazivProizvoda)
                      this.postojecaNarudzbina = el;
                  }

                }) 
                if (this.postojecaNarudzbina) {
                  this.servis.azurirajNarudzbinuKolicina(this.postojecaNarudzbina._id,
                    pr.kolicinaZaKupovinu).subscribe(data => {
                      this.trenutneNarudzbine.forEach(nar => {
                        if (nar._id == data._id) {
                          nar.kolicina += pr.kolicinaZaKupovinu;
                          this.flagZaNarucivanje = 1
                        }
                      })
                    })
                }
                else {



                  let n = {
                    nazivProizvoda: pr.nazivProizvoda,
                    preduzece: pr.preduzece,
                    mestoPreduzeca: data.mestoPreduzeca,
                    datumNarucivanja: new Date(),
                    mestoRasadnika: this.mestoRasadnika,
                    status: 'nije isporučena',
                    poljoprivrednik: this.loggedUser,
                    kolicina: pr.kolicinaZaKupovinu,
                    nazivRasadnika: this.nazivRasadnika,
                    identifikatorPorudzbine: novopreduzece ? noviidentifikator : this.noviindex,
                    uputstvo: pr.uputstvo,
                    ukupanBrojDana: pr.ukupanBrojDana,
                    vrstaProizvoda: pr.vrsta
                  }
 
                  this.servis.dodajNarudzbinu(n).subscribe(nar => {
                    this.servis.azurirajNarudzbinuDatum(nar._id).subscribe(data1 => {
                      this.trenutneNarudzbine.push(data1); 
                      this.flagZaNarucivanje = 1 
                    });
                  })

                }
                this.postojecaNarudzbina = null;
              }
            }

            else if (!pr.kolicinaZaKupovinu)
              this.mess = "Unesite količinu."
            else if (pr.kolicina != 0) {
              if (pr.kolicina < pr.kolicinaZaKupovinu) {
                if (this.mestoRasadnika && this.nazivRasadnika) {

                  let novopreduzece = null;
                  let noviidentifikator = null
                  this.trenutneNarudzbine.filter(el => {
                    if (el.preduzece == pr.preduzece) {
                      novopreduzece = el.preduzece
                      noviidentifikator = el.identifikatorPorudzbine
                      if (el.nazivProizvoda == pr.nazivProizvoda)
                        this.postojecaNarudzbina = el;
                    }

                  })
                  if (this.postojecaNarudzbina) {
                    this.servis.azurirajNarudzbinuKolicina(this.postojecaNarudzbina._id,
                      pr.kolicina).subscribe(data => {
                        this.trenutneNarudzbine.forEach(nar => {
                          if (nar._id == data._id) {
                            nar.kolicina += pr.kolicina;
                            this.flagZaNarucivanje = 1
                          }
                        })
                      })
                  }
                  else {

                    let n = {
                      nazivProizvoda: pr.nazivProizvoda,
                      preduzece: pr.preduzece,
                      mestoPreduzeca: data.mestoPreduzeca,
                      datumNarucivanja: new Date(),
                      mestoRasadnika: this.mestoRasadnika,
                      status: 'nije isporučena',
                      poljoprivrednik: this.loggedUser,
                      kolicina: pr.kolicina,
                      nazivRasadnika: this.nazivRasadnika,
                      identifikatorPorudzbine: novopreduzece ? noviidentifikator : this.noviindex,
                      uputstvo: pr.uputstvo,
                      ukupanBrojDana: pr.ukupanBrojDana,
                      vrstaProizvoda: pr.vrsta
                    }
 

                    this.servis.dodajNarudzbinu(n).subscribe(nar => {
                      this.servis.azurirajNarudzbinuDatum(nar._id).subscribe(data1 => {
                        this.trenutneNarudzbine.push(data1);

                  this.flagZaNarucivanje = 1
 
                      });
                    })
                  }
                  pr.kolicina = 0
                  this.postojecaNarudzbina = null;
                }
              }
            }

          }
        })
      } 
    });

    this.noviindex += 1;
    localStorage.setItem(`${this.loggedUser}identifikator`, JSON.stringify(this.noviindex))
 

  }



  obrisi(nar: Narudzbina) {

    this.servis.dohvatiProizvod(nar.preduzece, nar.nazivProizvoda).subscribe(
      data => {
 

        this.proizvodi.forEach(pr => {
          if (pr.nazivProizvoda == nar.nazivProizvoda) pr.kolicina += nar.kolicina
        })
        this.trenutneNarudzbine.forEach((el, index) => {
          if (el._id == nar._id) {

            this.trenutneNarudzbine.splice(index, 1);
            this.servis.obrisiN(nar._id).subscribe()
            if (this.trenutneNarudzbine.length == 0) this.flagZaFormu = true;
          }
        })
      
      })


  }

  message: string = ""
  viseNarudzbina: Narudzbina[] = []
  flagZaNarucivanje: number = 0;

  potvrdi() {
    this.flagZaFormu = true
    this.message = ""
    if (this.mestoRasadnika && this.nazivRasadnika) {

      this.message = "Uspešno ste poručili."

      this.trenutneNarudzbine.forEach((el, index) => {

        this.proizvodi.forEach(element => {


          if (/*element.cekirano &&*/ el.preduzece == element.preduzece && el.nazivProizvoda == element.nazivProizvoda) {
            this.servis.azurirajKolicinuProizvoda(element._id,
              el.kolicina * (-1)).subscribe(
                data => {
                  this.flagZaNarucivanje = 0
                  this.servis.sviProizvodi().subscribe(data => {
                    this.proizvodi = data
                    element.cekirano = false;
                  })

                }
              )
          }
        });



      })

      /*    this.proizvodi.forEach(element => {
          //  element.cekirano = false;
    
          if(element.cekirano) {
            this.servis.azurirajKolicinuProizvoda(element._id,
               element.kolicinaZaKupovinu * (-1)).subscribe(
              data => {
                this.flagZaNarucivanje = 0
                this.servis.sviProizvodi().subscribe(data => {
                   this.proizvodi = data
                  element.cekirano=false;
                })
                
                  }
            )
                }
          });*/

      //     this.flagZaNarucivanje = 0
      this.trenutneNarudzbine.splice(0, this.trenutneNarudzbine.length)
    }
    else this.message = "Unesite i mesto i naziv rasadnika."

  }

  glavna() {
    this.router.navigate(['/poljoprivrednik'])
  }
  logOut() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login'])
  }
}

export interface ProizvodKorpa extends Proizvod {
  cekirano: boolean;
  kolicinaZaKupovinu: number;

}
export interface Porudzbina {
  idNar: string;
  narudzbina: Narudzbina;
  identifikator: number;

}



