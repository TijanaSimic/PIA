import { Component, OnInit } from '@angular/core';
import { Narudzbina } from '../models/narudzbina';
import { ServisService } from '../servis.service';
import { Preduzece } from '../models/preduzece';
import * as Chart from 'chart.js';
import { Porudzbina, ProdavnicaComponent } from '../prodavnica/prodavnica.component';
import { Router } from '@angular/router';





@Component({
  selector: 'app-preduzece',
  templateUrl: './preduzece.component.html',
  styleUrls: ['./preduzece.component.css']
})
export class PreduzeceComponent implements OnInit {

  constructor(private servis: ServisService, private router: Router) { }

  narudzbine: Narudzbina[] = [];

  kuriri: number = 0;
  loggedUser: string;
  ulogovanoPreduzece: Preduzece;

  identifikatorFlag: klasaZaIdentifikatore[] = []

  poslateNarudzbine: Narudzbina[] = [];

  nizNarudzbinaZaMesecDana: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]

  ngOnInit(): void {

    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    this.nizNarudzbinaZaMesecDana = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.nizNarudzbinaZaMesecDana.forEach((nar, index) => {
      this.nizLabela[index] = new Date(new Date().getTime() - (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString()
    })
    this.servis.tridesetDana(this.loggedUser).subscribe(data => {
      let duzina = data.length;
      data.forEach(element => {
        let year = element._id.year
        let month = element._id.month
        let day = element._id.day
        let stariDatum = new Date(year, month - 1, day)
        let pozicija = Math.trunc((Number)(new Date().getTime() - stariDatum.getTime()) / (24 * 60 * 60 * 1000))
        this.nizNarudzbinaZaMesecDana[pozicija - 1] = element.count

      });

    })
   /* localStorage.clear()
     localStorage.setItem('p1', JSON.stringify(35))
     localStorage.setItem('p2', JSON.stringify(35))*/

    this.kuriri = JSON.parse(localStorage.getItem(`${this.loggedUser}`))
    this.servis.pretragaPredUsername(this.loggedUser).subscribe(data => this.ulogovanoPreduzece = data);
    this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
      this.narudzbine = data
      this.narudzbine.forEach((nar) => {
        let el = JSON.parse(localStorage.getItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`));

        if (el) {
          let result = this.identifikatorFlag.filter(elem => elem.identifikator == nar.identifikatorPorudzbine)

          if (result.length == 0 && nar.status == 'isporuka u toku') {

            let obj: klasaZaIdentifikatore = {
              identifikator: nar.identifikatorPorudzbine,
              flag: 1
            }
            this.identifikatorFlag.push(obj)
          //  console.log('Pocetno vreme je ', el[2], 'duzina cekanja', el[3], 'a id je', el[0]);

            let novi = el[3] + parseInt(el[2], 10) - new Date().getTime();

            if (novi <= 0) novi = 0;
            el[2] = new Date().getTime();

            let objekat = [nar.identifikatorPorudzbine, nar.poljoprivrednik, new Date().getTime(), novi]

            localStorage.setItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`, JSON.stringify(objekat));


            setTimeout(() => {
              this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
              this.servis.dohvatiNarudzbineSaIstimIdentifikatoromiPolj(nar.identifikatorPorudzbine,
                nar.poljoprivrednik).subscribe(data => {
                  if (data.length > 0) {
                    data.forEach(nar => {
                      let n = {

                        _id: nar._id,
                        status: 'isporučena'
                      }
                      this.servis.azurirajNarudzbinuStatus(n).subscribe()
                      this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
                        this.narudzbine = data
                        this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
                          if (a.status == 'na čekanju') return -1;
                          else return 0;
                        });
                      })
                    })
                  }
                })

              this.kuriri = <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`))
            //  console.log('pre ulaza je broj kurira', <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`)))

              let objekat = [nar.identifikatorPorudzbine, nar.poljoprivrednik, new Date().getTime(), 0]

              localStorage.setItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`, JSON.stringify(objekat));

              let el = JSON.parse(localStorage.getItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}`))

              localStorage.setItem(`${this.loggedUser}`, JSON.stringify(this.kuriri + 1));
              this.kuriri = <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`))
              localStorage.setItem(`${nar.identifikatorPorudzbine},${nar.poljoprivrednik}flag`, 'kuriri');
            //  console.log("hello, broj kurira je", this.kuriri);
            }, novi);
          }


        }
      })


      this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
        if (a.status == 'na čekanju') return -1;
        else return 0;
      });
    })

  }



  sortByDueDate(): void {

    this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
      return +new Date(b.datumNarucivanja) - +new Date(a.datumNarucivanja);
      //+ konvertuje datum u broj


    })
  }

  odbij(id) {
    this.servis.obrisiN(id).subscribe(data1 => {
      this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
        this.narudzbine = data
        this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
          if (a.status == 'na čekanju') return -1;
          else return 0;
        });
      });
    });

  }




  narudzbineSaIstimIdentifikatorom: Narudzbina[] = []

  prikaziCelu(identifikator, polj) {
    console.log(identifikator,polj,this.loggedUser);
    this.servis.dohvatiNarudzbineSaIstimIdentifikatoromiPred(identifikator, polj, this.loggedUser).subscribe(data => {
      this.narudzbineSaIstimIdentifikatorom = data
      console.log(this.narudzbineSaIstimIdentifikatorom)
 
    })
  }


  odobri(narudzbine: Narudzbina[]) {
    let poljoprivrednik = narudzbine[0].poljoprivrednik
    let identifikator = narudzbine[0].identifikatorPorudzbine
    let mestoRasadnika = narudzbine[0].mestoRasadnika
    let datumNarucivanja = narudzbine[0].datumNarucivanja

    this.kuriri = <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`))
    if (this.kuriri > 0) {
      this.kuriri = this.kuriri - 1;
      localStorage.setItem(`${this.loggedUser}`, JSON.stringify(this.kuriri));

      this.servis.koordinate(this.ulogovanoPreduzece.mestoPreduzeca).subscribe((data1) => {      
        this.servis.koordinate(mestoRasadnika).subscribe((data2) => {
 
         // console.log(this.ulogovanoPreduzece.mestoPreduzeca,mestoRasadnika)
   /*    console.log(  data1.resourceSets[0].resources[0].point.coordinates[0],
            data1.resourceSets[0].resources[0].point.coordinates[1],
            data2.resourceSets[0].resources[0].point.coordinates[0],
            data2.resourceSets[0].resources[0].point.coordinates[1])*/

          this.servis.vremePutovanja(
            data1.resourceSets[0].resources[0].point.coordinates[0],
            data1.resourceSets[0].resources[0].point.coordinates[1],
            data2.resourceSets[0].resources[0].point.coordinates[0],
            data2.resourceSets[0].resources[0].point.coordinates[1],
             datumNarucivanja
          ).subscribe(data3 => {
            let milisek = data3.resourceSets[0].resources[0].results[0].travelDuration*60*1000; 
           // console.log(JSON.stringify(data3))
          //  console.log('vreme je ', milisek, milisek/1000/60/60);

            narudzbine.forEach(nar => {
              let n = {

                _id: nar._id,
                status: 'isporuka u toku',

              }
              this.servis.azurirajNarudzbinuStatus(n).subscribe(data => {
                this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
                  this.narudzbine = data
                  this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
                    if (a.status == 'na čekanju') return -1;
                    else return 0;
                  });
                })
              })
            })

            let objekat = [identifikator, poljoprivrednik, new Date().getTime(), milisek]
            localStorage.setItem(`${identifikator},${poljoprivrednik}`, JSON.stringify(objekat));
            let el = JSON.parse(localStorage.getItem(`${identifikator},${poljoprivrednik}`))
          //  console.log('iz local storidza', el)

            setTimeout(() => {
              this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
              narudzbine.forEach(nar => {
                let n = {

                  _id: nar._id,
                  status: 'isporučena'
                }
                this.servis.azurirajNarudzbinuStatus(n).subscribe()
                this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
                  this.narudzbine = data
                  this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
                    if (a.status == 'na čekanju') return -1;
                    else return 0;
                  });
                }
                )
              })
              this.kuriri = <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`))
           //   console.log('pre ulaza je broj kurira', <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`)))

              let objekat = [identifikator, poljoprivrednik, new Date().getTime(), 0]
              localStorage.setItem(`${identifikator},${poljoprivrednik}`, JSON.stringify(objekat));

              let el = JSON.parse(localStorage.getItem(`${identifikator},${poljoprivrednik}`)) //obrisati
             // console.log('iz local storidza u timeout', el)


              localStorage.setItem(`${this.loggedUser}`, JSON.stringify(this.kuriri + 1));
              this.kuriri = <number>JSON.parse(localStorage.getItem(`${this.loggedUser}`))
              localStorage.setItem(`${identifikator},${poljoprivrednik}flag`, 'kuriri');
          //    console.log("hello, broj kurira je", this.kuriri);

            }, milisek);

          })
        }
        )
      })

    }
    else {
      narudzbine.forEach(nar => {
        let n = {
          _id: nar._id,
          status: 'na čekanju',


        }

        this.servis.azurirajNarudzbinuStatus(n).subscribe(data => {
          this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
            this.narudzbine = data;
            this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
              if (a.status == 'na čekanju') return -1;
              else return 0;
            });
          })
        })
      })

    }
  }


  otkaziNarudzbinu(narudzbine: Narudzbina[]) {
    if(narudzbine[0].status!='isporuka u toku' && narudzbine[0].status!='isporučena') {
    narudzbine.forEach(nar => {
      this.servis.obrisiN(nar._id).subscribe(data => {
         this.servis.dohvatiSveNarudzbine(this.loggedUser).subscribe(data => {
          this.narudzbine = data
          this.narudzbine.sort((a: Narudzbina, b: Narudzbina) => {
            if (a.status == 'na čekanju') return -1;
            else return 0;
          });
        })
      })
      });
    }
  }


  logOut() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login'])
  }

  oldPassword: string;
  newFirst: string;
  newSecond: string;
  old: string = ""

  messageZaPromenuLozinke: string = "";

  promeni() {
    let izraz1 = /\W+/
    let izraz2 = /[A-Z]+/
    let izraz3 = /\d+/
    let izraz4 = /.{7,}/
    let izraz5 = /^[a-z,A-Z]/

    this.servis.pretragaPredUsername(this.loggedUser).subscribe(data => {
      if (data) {
        this.old = data.password;
        if (this.old != this.oldPassword)
          this.messageZaPromenuLozinke = 'Stara lozinka nije dobra.'
        else {

          if (this.newFirst == null || this.newSecond == null || this.oldPassword == null)
            this.messageZaPromenuLozinke = "Unesite sva polja."
          else {

            if (this.oldPassword == this.newFirst || this.oldPassword == this.newSecond)
              this.messageZaPromenuLozinke = "Nova lozinka je ista kao stara.";
            else {
              if (this.newFirst != this.newSecond)
                this.messageZaPromenuLozinke = "Lozinke se ne poklapaju."

              else {
                if (izraz1.test(this.newFirst) == false || izraz2.test(this.newFirst) == false || izraz3.test(this.newFirst) == false || izraz4.test(this.newFirst) == false || izraz5.test(this.newFirst) == false) {
                  this.messageZaPromenuLozinke = "Pogrešan format lozinke.";
                }
                else {
                  this.servis.obrisiPreduzece(this.loggedUser).subscribe(data => {
                    this.servis.dodajPreduzece(this.ulogovanoPreduzece.naziv,
                      this.ulogovanoPreduzece.username, this.newFirst, this.ulogovanoPreduzece.datumOsnivanja, this.ulogovanoPreduzece.mestoPreduzeca,
                      this.ulogovanoPreduzece.email).subscribe(data => {
                        this.ulogovanoPreduzece = data;
                        this.messageZaPromenuLozinke = "Lozinka je uspešno promenjena."
                        this.router.navigate(['/login'])
                      })
                  });


                }
              }
            }
          }
        }
      }
    })

  }

  LineChart: any = [];
  nizLabela: string[] = []




  prikazi() {


    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.nizLabela,
        datasets: [{
          label: 'Broj narudžbina po danu',
          data: this.nizNarudzbinaZaMesecDana,
          fill: false,
          lineTension: 0.2,
          borderColor: "red",
          borderWidth: 1

        }]
      },
      options: {
        title: {
          text: "Line Chart",
          display: true
        }
      }
    });
  }

  proizvodiPreduzeca() {
    this.router.navigate(['/proizvodi'])
  }

}

export class klasaZaIdentifikatore {
  identifikator: number
  flag: number = 0
}