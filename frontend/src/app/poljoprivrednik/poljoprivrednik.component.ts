import { Component, OnInit } from '@angular/core';
import { ServisService } from '../servis.service';
import { Poljoprivrednik } from '../models/poljoprivrednik';
import { Rasadnik } from '../models/rasadnik';
import { Router } from '@angular/router';
import { Narudzbina } from '../models/narudzbina';
import { klasaZaIdentifikatore } from '../preduzece/preduzece.component';

@Component({
  selector: 'app-poljoprivrednik',
  templateUrl: './poljoprivrednik.component.html',
  styleUrls: ['./poljoprivrednik.component.css']
})
export class PoljoprivrednikComponent implements OnInit {

  constructor(private servis: ServisService, private router: Router) { }

  loggedInUser: string;
  ulogovaniPoljoprivrednik: Poljoprivrednik;
  rasadnici: Rasadnik[] = []
  narudzbine: Narudzbina[] = []

  identifikatorFlag: klasaZaIdentifikatore[] = []
  indeksiZaBrisanje: number[] = []
  narudzbineSaIstimIdentifikatorom: Narudzbina[] = []

  ngOnInit(): void {


    this.loggedInUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.servis.pretragaPoljUsername(this.loggedInUser).subscribe(data => this.ulogovaniPoljoprivrednik = data)
    this.servis.dohvatiRasadnike(this.loggedInUser).subscribe(data => {
      this.rasadnici = data;
      this.rasadnici.filter(el => {
        if (el.temperatura < 12 || el.kolicinaVode < 75)
          this.nizOdrzavanje.push(el)
      })
      this.servis.dohvatiNarudzbinePoljoprivrednika(this.loggedInUser).subscribe(data => {
        this.narudzbine = data

        this.narudzbine.forEach((nar) => {
          //   console.log('usao sam u for each', nar.identifikatorPorudzbine, nar.poljoprivrednik)
          let el = JSON.parse(localStorage.getItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));
          //  console.log(el)
          if (el && (nar.status == 'isporuka u toku' || nar.status == 'isporučena')) {
            let result = this.identifikatorFlag.filter(elem => elem.identifikator == nar.identifikatorPorudzbine)
            //    console.log(result)
            if (result.length == 0) {
              //     console.log('usao u if')
              let obj: klasaZaIdentifikatore = {
                identifikator: nar.identifikatorPorudzbine,
                flag: 1
              }
              this.identifikatorFlag.push(obj)

              //     console.log('Pocetno vreme je ', el[2], 'duzina cekanja', el[3], 'a id je', el[0]);

              let novi = el[3] + parseInt(el[2], 10) - new Date().getTime();

              if (novi <= 0) novi = 0;
              el[2] = new Date().getTime();

              if (novi == 0) {
                this.servis.dohvatiNarudzbineSaIstimIdentifikatoromiPolj(nar.identifikatorPorudzbine,
                  nar.poljoprivrednik).subscribe(data => {
                    //    console.log('identif je', nar.identifikatorPorudzbine, ' a polj ej ', nar.identifikatorPorudzbine)
                    this.narudzbineSaIstimIdentifikatorom = data
                    this.narudzbineSaIstimIdentifikatorom.forEach(narudzbina => {
                      //     console.log('polj je', nar.poljoprivrednik, narudzbina.poljoprivrednik,
                      //    'a mesto je', nar.mestoRasadnika, narudzbina.mestoRasadnika)
                      this.servis.dohvatiRasadnikNaOsnovuPoljNaziv(narudzbina.poljoprivrednik, narudzbina.nazivRasadnika).subscribe(
                        data => {
                          let rasadnik = data
                          //     console.log('data', data)
                          if (data) {
                            let id = rasadnik._id
                            //     console.log('id ej')
                            let dodati = {
                              nazivProizvoda: narudzbina.nazivProizvoda,
                              proizvodjac: narudzbina.preduzece,
                              kolicina: narudzbina.kolicina,
                              idRasadnika: id,
                              vrsta: narudzbina.vrstaProizvoda, //0-sadnica 1-preparat
                              uputstvo: narudzbina.uputstvo, //o ako je sadnica, sve ostalo ako je preparat
                              ukupanBrojDana: narudzbina.ukupanBrojDana
                            }
                            //     console.log('DODATI JE',dodati)
                            this.servis.dodajNarudzbinuUMagacin(dodati).subscribe(data => {
                              let n = {

                                _id: narudzbina._id,
                                status: 'isporučena'
                              }
                              //      console.log('DATA JE',data)
                              this.servis.azurirajNarudzbinuStatus(n).subscribe()

                            })
                            //   localStorage.removeItem((`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));
                          }
                        })
                    })
                    let kuriri = <number>JSON.parse(localStorage.getItem(`${nar.preduzece}`))
                    //    console.log('kuriri su,', kuriri)
                    let kuriripotvrda: string = localStorage.getItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}flag`)
                    //    console.log(kuriripotvrda)
                    if (!kuriripotvrda)
                      localStorage.setItem(`${nar.preduzece}`, JSON.stringify(kuriri + 1));
                    localStorage.removeItem((`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));
                  })
              }
              else {
                let objekat = [nar.identifikatorPorudzbine, nar.poljoprivrednik, new Date().getTime(), novi]
                localStorage.setItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`, JSON.stringify(objekat));

                setTimeout(() => {
                  this.servis.dohvatiNarudzbineSaIstimIdentifikatoromiPolj(nar.identifikatorPorudzbine,
                    nar.poljoprivrednik).subscribe(data => {
                      this.narudzbineSaIstimIdentifikatorom = data
                      this.narudzbineSaIstimIdentifikatorom.forEach(narudzbina => {
                        this.servis.dohvatiRasadnikNaOsnovuPoljNaziv(narudzbina.poljoprivrednik, narudzbina.nazivRasadnika).subscribe(
                          data => {
                            // console.log(narudzbina.poljoprivrednik,narudzbina.mestoRasadnika)
                            // console.log('RASADNIK JE',data)
                            if (data) {
                              let id = data._id
                              let dodati = {
                                nazivProizvoda: narudzbina.nazivProizvoda,
                                proizvodjac: narudzbina.preduzece,
                                kolicina: narudzbina.kolicina,
                                idRasadnika: id,
                                vrsta: narudzbina.vrstaProizvoda, //0-sadnica 1-preparat
                                uputstvo: narudzbina.uputstvo, //o ako je sadnica, sve ostalo ako je preparat
                                ukupanBrojDana: narudzbina.ukupanBrojDana
                              }
                              // console.log('DODATI JE',dodati)
                              this.servis.dodajNarudzbinuUMagacin(dodati).subscribe(data => {
                                //     console.log('azurirani obj je',data)
                                let n = {

                                  _id: narudzbina._id,
                                  status: 'isporučena'
                                }
                                this.servis.azurirajNarudzbinuStatus(n).subscribe()
                              })
                            }
                            // ovo ispod premestam da se ne izvrsava za svaku nar
                            //localStorage.removeItem((`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));
                          })
                      })
                      let kuriri = <number>JSON.parse(localStorage.getItem(`${nar.preduzece}`))
                      //   console.log('kuriri su,', kuriri)
                      let kuriripotvrda: string = localStorage.getItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}flag`)
                      // console.log(kuriripotvrda)
                      if (!kuriripotvrda)
                        localStorage.setItem(`${nar.preduzece}`, JSON.stringify(kuriri + 1));
                      //  console.log('kuriri su,', kuriri)
                      localStorage.removeItem((`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));

                    })
                }, novi);
              }
            }
          }
        })
      })
    })
  }

  oldPassword: string;
  newFirst: string;
  newSecond: string;
  old: string = ""

  message: string = "";

  promeni() {
    let izraz1 = /\W+/
    let izraz2 = /[A-Z]+/
    let izraz3 = /\d+/
    let izraz4 = /.{7,}/
    let izraz5 = /^[a-z,A-Z]/

    this.servis.pretragaPoljUsername(this.loggedInUser).subscribe(data => {
      if (data) {
        this.old = data.password;
        if (this.old != this.oldPassword)
          this.message = 'Stara lozinka nije dobra.'
        else {
          if (this.newFirst == null || this.newSecond == null || this.oldPassword == null)
            this.message = "Unesite sva polja."
          else {

            if (this.oldPassword == this.newFirst || this.oldPassword == this.newSecond)
              this.message = "Nova lozinka je ista kao stara.";
            else {
              if (this.newFirst != this.newSecond)
                this.message = "Lozinke se ne poklapaju."

              else {
                if (izraz1.test(this.newFirst) == false || izraz2.test(this.newFirst) == false || izraz3.test(this.newFirst) == false || izraz4.test(this.newFirst) == false || izraz5.test(this.newFirst) == false) {
                  this.message = "Pogrešan format lozinke.";
                }
                else {
                  this.servis.obrisiPoljoprivrednika(this.loggedInUser).subscribe(
                    data => {
                      this.servis.dodajPoljoprivrednika(this.ulogovaniPoljoprivrednik.ime,
                        this.ulogovaniPoljoprivrednik.prezime, this.ulogovaniPoljoprivrednik.username, this.newFirst, this.ulogovaniPoljoprivrednik.datumRodjenja, this.ulogovaniPoljoprivrednik.mestoRodjenja,
                        this.ulogovaniPoljoprivrednik.telefon, this.ulogovaniPoljoprivrednik.email).subscribe(data => {
                          this.ulogovaniPoljoprivrednik = data;
                          this.message = "Lozinka je uspešno promenjena."
                          this.router.navigate(['/login'])
                        })
                    } 
                  );


                }
              }
            }
          }
        }
      }
    })
    //   console.log(JSON.parse(localStorage.getItem('loggedUser')))
  }

  naziv: string;
  mesto: string;
  duzina: number;
  sirina: number;
  messDodavanje: string = "";

  logOut() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login'])
  }

  dodaj() {
    this.servis.dohvatiRasadnikNaOsnovuPoljNaziv(this.loggedInUser, this.naziv).subscribe(data => {
      if (!data) {
        this.servis.dodajRasadnik(this.naziv, this.mesto, this.duzina, this.sirina, this.loggedInUser).
          subscribe(data1 => {
            this.messDodavanje = "Rasadnik je dodat."
            //  localStorage.setItem(`${data1._id}VT`, JSON.stringify(data1.datumOsnivanja))
            let datum = new Date(data1.datumOsnivanja)

            localStorage.setItem(`${data1._id}VT`, JSON.stringify(datum.getTime()))
            this.servis.dohvatiRasadnike(this.loggedInUser).subscribe(data => {

              this.rasadnici = data

            })
          })
      }
      else this.messDodavanje = "Rasadnik sa ovim imenom već postoji."
    })

  }

  prikaz(id) {

    localStorage.setItem(`rasadnik`, JSON.stringify(id));
    this.router.navigate(['/vizuelniPrikaz']);
  }

  nizOdrzavanje: Rasadnik[] = []

  onlineProd() {
    this.router.navigate(['/prodavnica'])
  }
}

export class PojedinacneN {
  proizvodi: Narudzbina[] = [];
  identifikator: number;
}