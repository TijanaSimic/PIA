import { Component, OnInit } from '@angular/core';
import { Zahtev } from '../models/zahtev';
import { ServisService } from '../servis.service';
import { Poljoprivrednik } from '../models/poljoprivrednik';
import { Preduzece } from '../models/preduzece';
import { Router } from '@angular/router';
import { Narudzbina } from '../models/narudzbina';
import { Rasadnik } from '../models/rasadnik';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private servis: ServisService, private router: Router) { }


  loggedInUser: string;

  flagZaPrikaz: number = 0;

  ngOnInit(): void {
    this.flagZaPrikaz = 0;
    this.loggedInUser = JSON.parse(localStorage.getItem('loggedUser'));
    this.servis.zahtevi().subscribe(data => {
      this.zahtevi = data

    })
  }

  zahtevi: Zahtev[] = [];

  prihvati(username) {
    this.zahtevi.forEach((zahtev, index) => {
      if (zahtev.username == username)
        if (zahtev.tipKorisnika == 'poljoprivrednik') {
          this.servis.dodajPoljoprivrednika(zahtev.ime,
            zahtev.prezime, zahtev.username, zahtev.password,
            zahtev.datumRodjenja, zahtev.mestoRodjenja,
            zahtev.telefon, zahtev.email).subscribe();
          localStorage.setItem(`${zahtev.username}identifikator`, JSON.stringify(0))
          this.servis.obrisiZahtev(zahtev._id).subscribe(data => {
            this.zahtevi.splice(index, 1);
          });
        }
        else if (zahtev.tipKorisnika == 'preduzece') {
          this.servis.dodajPreduzece(zahtev.nazivPreduzeca,
            zahtev.username, zahtev.password,
            zahtev.datumOsnivanja, zahtev.mestoPreduzeca,
            zahtev.email).subscribe();
          localStorage.setItem(`${zahtev.username}`, JSON.stringify(5));
          this.servis.obrisiZahtev(zahtev._id).subscribe(data => {
            this.zahtevi.splice(index, 1);
          });
        }
    })

  }

  odbij(username) {
    this.zahtevi.forEach((zahtev, index) => {
      if (zahtev.username == username) {
        this.servis.obrisiZahtev(zahtev._id).subscribe(data => {
          this.zahtevi.splice(index, 1);
        })

      }
    })
  }


  tip: number; //0-poljoprivrednik 1-preduzece


  imePolj: string;
  prezimePolj: string;
  usernamePolj: string;
  passwordPolj: string;
  potvrdaPolj: string;
  datumPolj: string;
  mestoPolj: string;
  telefonPolj: string;
  emailPolj: string;
  messagePolj: string = "";

  message: string;




  dodajPoljoprivrednika() {

    this.message = "";
    this.messagePolj = ""

    this.servis.pretragaPoljUsername(this.usernamePolj).subscribe(data => {
      if (!data) {
        this.servis.pretragaPredUsername(this.usernamePolj).subscribe(data1 => {
          if (!data1) {
            this.servis.pretragaAdminUsername(this.usernamePolj).subscribe(data2 => {
              if (!data2) {
                this.servis.pretragaZahtevaUsername(this.usernamePolj).subscribe(data3 => {
                  if (!data3) {

                    let izraz1 = /\W+/
                    let izraz2 = /[A-Z]+/
                    let izraz3 = /\d+/
                    let izraz4 = /.{7,}/
                    let izraz5 = /^[a-z,A-Z]/

                    if (this.passwordPolj != this.potvrdaPolj)
                      this.message = "Lozinke se ne poklapaju."

                    else
                      if (izraz1.test(this.passwordPolj) == false ||
                        izraz2.test(this.passwordPolj) == false || izraz3.test(this.passwordPolj)
                        == false || izraz4.test(this.passwordPolj) == false ||
                        izraz5.test(this.passwordPolj) == false)
                        this.message = "Pogrešan format lozinke.";

                      else {

                        this.message = "Lozinka odgovara."

                        this.servis.dodajPoljoprivrednika(this.imePolj, this.prezimePolj, this.usernamePolj,
                          this.passwordPolj, this.datumPolj,
                          this.mestoPolj, this.telefonPolj,
                          this.emailPolj).subscribe(data => {
                            localStorage.setItem(`${this.usernamePolj}identifikator`, JSON.stringify(0))
                            this.messagePolj = 'Uspešno dodavanje.'
                          }
                          );
                      }
                  }
                  else this.messagePolj = "Korisničko ime je zauzeto."
                })
              }
              else this.messagePolj = "Korisničko ime je zauzeto."

            })
          }
          else this.messagePolj = "Korisničko ime je zauzeto."
        })
      }
      else this.messagePolj = "Korisničko ime je zauzeto."
    });

  }

  nazivPred: string;
  usernamePred: string;
  passwordPred: string;
  potvrdaPred: string;
  datumPred: string;
  mestoPred: string;
  emailPred: string;
  messagePred: string;
  message1: string = "";

  dodajPreduzece() {


    this.message1 = "";
    this.messagePred = ""

    this.servis.pretragaPredUsername(this.usernamePred).subscribe(data => {
      if (!data) {
        this.servis.pretragaPoljUsername(this.usernamePred).subscribe(data1 => {
          if (!data1) {
            this.servis.pretragaAdminUsername(this.usernamePred).subscribe(data2 => {
              if (!data2) {
                this.servis.pretragaZahtevaUsername(this.usernamePred).subscribe(data3 => {
                  if (!data3) {

                    let izraz1 = /\W+/
                    let izraz2 = /[A-Z]+/
                    let izraz3 = /\d+/
                    let izraz4 = /.{7,}/
                    let izraz5 = /^[a-z,A-Z]/

                    if (this.passwordPred != this.potvrdaPred)
                      this.message1 = "Lozinke se ne poklapaju."

                    else
                      if (izraz1.test(this.passwordPred) == false ||
                        izraz2.test(this.passwordPred) == false || izraz3.test(this.passwordPred)
                        == false || izraz4.test(this.passwordPred) == false ||
                        izraz5.test(this.passwordPred) == false)
                        this.message1 = "Pogrešan format lozinke.";

                      else {

                        this.message1 = "Lozinka odgovara."

                        this.servis.dodajPreduzece(this.nazivPred, this.usernamePred,
                          this.passwordPred, this.datumPred,
                          this.mestoPred,
                          this.emailPred).subscribe(data => {
                            localStorage.setItem(`${this.usernamePred}`, JSON.stringify(5));
                            this.messagePred = 'Uspešno dodavanje.'
                          }
                          );
                      }
                  }
                  else this.messagePred = "Korisničko ime je zauzeto."
                })
              }
              else this.messagePred = "Korisničko ime je zauzeto."

            })
          }
          else this.messagePred = "Korisničko ime je zauzeto."
        })
      }
      else this.messagePred = "Korisničko ime je zauzeto."
    });


  }

  tipBrisanja: number; //0-polj 1-pred
  brisanjeUsername: string;
  messageZaBrisanje: string = ''

  narudzbinePoljoprivrednika: Narudzbina[] = []

  brisi() {
    this.messageZaBrisanje = ''
    if (this.tipBrisanja == 0) {
      this.servis.pretragaPoljUsername(this.brisanjeUsername).subscribe(data1 => {
        if (data1) {
          this.servis.sveNarudzbineJednogPolj(data1.username).subscribe(data => {
            this.narudzbinePoljoprivrednika = data

            this.narudzbinePoljoprivrednika.forEach(narudzbina => {

              let objekat = JSON.parse(localStorage.getItem(`${narudzbina.identifikatorPorudzbine},${narudzbina.poljoprivrednik}`))
              if (objekat) {
                let kuriri = JSON.parse(localStorage.getItem(`${narudzbina.preduzece}`))

                localStorage.setItem(`${narudzbina.preduzece}`, JSON.stringify(kuriri + 1));

                localStorage.removeItem(`${narudzbina.identifikatorPorudzbine},${narudzbina.poljoprivrednik}`)
              }
              this.servis.obrisiN(narudzbina._id).subscribe();

            });
            this.servis.obrisiSveNarPoljIzMagacina(data1.username).subscribe(data => {
              this.servis.dohvatiRasadnike(this.brisanjeUsername).subscribe(data => {
                let rasadnici: Rasadnik[] = data;
                if (rasadnici) {
                  rasadnici.forEach(element => {
                    this.servis.obrisiIzMagacinaPoIdRasadnika(element._id).subscribe(data => {
                      this.servis.obrisiSveRasadnikePolj(data1.username).subscribe(data => {

                        this.servis.obrisiSveSadnicePolj(data1.username).subscribe(data => {

                          this.servis.obrisiPoljoprivrednika(this.brisanjeUsername).subscribe(data => {
                            this.messageZaBrisanje = 'Korisnik je obrisan.'
                          });

                        })
                      })
                    })
                  });
                }
              })

            })

          })

        }
        else
          this.messageZaBrisanje = 'Ne postoji taj korisnik.'
      })

    }


    else if (this.tipBrisanja == 1) {
      this.servis.pretragaPredUsername(this.brisanjeUsername).subscribe(data => {
        if (data) {
          this.servis.obrisiSveOcenePreduzeca(this.brisanjeUsername).subscribe(data => {
            this.servis.obrisiSveKomPreduzeca(this.brisanjeUsername).subscribe(data => {
              this.servis.obrisiSveProizvodePred(this.brisanjeUsername).subscribe(data => {
                this.servis.obrisiSveNarudzbineJednogPred(this.brisanjeUsername).subscribe(
                  data => {
                    this.servis.obrisiPreduzece(this.brisanjeUsername).subscribe(data => {
                      this.messageZaBrisanje = 'Korisnik je obrisan.'
                    });
                  })
              })
            })
          })



        }
        else
          this.messageZaBrisanje = 'Ne postoji taj korisnik.'
      })
    }


  }


  tipAzuriranja: number; //0-polj 1-pred

  poljoprivrednikZaAzuriranje: Poljoprivrednik;
  preduzeceZaAzuriranje: Preduzece;

  usernameZaAzuriranje: string;
  flagZaTabeluAzuriranja: number = 0;
  messageZaTabeluAzuriranja: string = ""

  izaberi() {
    this.messageZaTabeluAzuriranja = ""
    this.flagZaTabeluAzuriranja = 0
    if (this.tipAzuriranja == 0)
      this.servis.pretragaPoljUsername(this.usernameZaAzuriranje).subscribe(data => {
        this.poljoprivrednikZaAzuriranje = data
        if (this.poljoprivrednikZaAzuriranje)
          this.flagZaTabeluAzuriranja = 1;
        else
          this.messageZaTabeluAzuriranja = 'Ne postoji taj korisnik.'
      });
    else if (this.tipAzuriranja == 1)
      this.servis.pretragaPredUsername(this.usernameZaAzuriranje).subscribe(data => {
        this.preduzeceZaAzuriranje = data
        if (this.preduzeceZaAzuriranje)
          this.flagZaTabeluAzuriranja = 1
        else
          this.messageZaTabeluAzuriranja = 'Ne postoji taj korisnik.'
      });



  }

  imePoljA: string;
  prezimePoljA: string;
  usernamePoljA: string;
  passwordPoljA: string;
  datumPoljA: string;
  mestoPoljA: string;
  telefonPoljA: string;
  emailPoljA: string;

  porukaZaAzuriranje: string = "";

  mess: string = "ok";

  azurirajPolj() {

    this.porukaZaAzuriranje = "";
    this.mess = 'ok';
    let p = {
      ime: this.imePoljA ? this.imePoljA : this.poljoprivrednikZaAzuriranje.ime,
      prezime: this.prezimePoljA ? this.prezimePoljA : this.poljoprivrednikZaAzuriranje.prezime,
      username: this.usernamePoljA ? this.usernamePoljA : this.poljoprivrednikZaAzuriranje.username,
      password: this.passwordPoljA ? this.passwordPoljA : this.poljoprivrednikZaAzuriranje.password,
      datum: this.datumPoljA ? this.datumPoljA : this.poljoprivrednikZaAzuriranje.datumRodjenja,
      mesto: this.mestoPoljA ? this.mestoPoljA : this.poljoprivrednikZaAzuriranje.mestoRodjenja,
      telefon: this.telefonPoljA ? this.telefonPoljA : this.poljoprivrednikZaAzuriranje.telefon,
      email: this.emailPoljA ? this.emailPoljA : this.poljoprivrednikZaAzuriranje.email

    }


    if (p.password != this.poljoprivrednikZaAzuriranje.password) {

      let izraz1 = /\W+/
      let izraz2 = /[A-Z]+/
      let izraz3 = /\d+/
      let izraz4 = /.{7,}/
      let izraz5 = /^[a-z,A-Z]/


      if (izraz1.test(p.password) == false ||
        izraz2.test(p.password) == false || izraz3.test(p.password)
        == false || izraz4.test(p.password) == false ||
        izraz5.test(p.password) == false) {
        this.mess = "not";
        this.porukaZaAzuriranje = " Pogrešan format lozinke."
      }
    }

    if (p.username != this.poljoprivrednikZaAzuriranje.username) {

      this.servis.pretragaPoljUsername(p.username).subscribe(data => {
        if (!data) {
          this.servis.pretragaPredUsername(p.username).subscribe(data1 => {
            if (!data1) {
              this.servis.pretragaAdminUsername(p.username).subscribe(data2 => {
                if (!data2) {
                  this.servis.pretragaZahtevaUsername(p.username).subscribe(data3 => {
                    if (!data3) {
                      if (this.mess == 'ok') {
                        this.servis.obrisiPoljoprivrednika(this.poljoprivrednikZaAzuriranje.username).subscribe();

                        this.servis.dodajPoljoprivrednika(p.ime, p.prezime, p.username, p.password,
                          p.datum, p.mesto, p.telefon, p.email).subscribe(data => {
                            this.poljoprivrednikZaAzuriranje = data

                          })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    }



    else {
      if (this.mess == 'ok') {
        this.servis.obrisiPoljoprivrednika(this.poljoprivrednikZaAzuriranje.username).subscribe();

        this.servis.dodajPoljoprivrednika(p.ime, p.prezime, p.username, p.password,
          p.datum, p.mesto, p.telefon, p.email).subscribe(data => {
            this.poljoprivrednikZaAzuriranje = data

          })
      }
    }

  }

  nazivPredA: string;
  usernamePredA: string;
  passwordPredA: string;
  datumPredA: string;
  mestoPredA: string;
  emailPredA: string;



  mess1: string = "ok";
  porukaZaAzuriranje1: string = "";

  azurirajPreduzece() {

    this.porukaZaAzuriranje1 = "";
    this.mess1 = 'ok';
    let p = {
      ime: this.nazivPredA ? this.nazivPredA : this.preduzeceZaAzuriranje.naziv,
      username: this.usernamePredA ? this.usernamePredA : this.preduzeceZaAzuriranje.username,
      password: this.passwordPredA ? this.passwordPredA : this.preduzeceZaAzuriranje.password,
      datum: this.datumPredA ? this.datumPredA : this.preduzeceZaAzuriranje.datumOsnivanja,
      mesto: this.mestoPredA ? this.mestoPredA : this.preduzeceZaAzuriranje.mestoPreduzeca,
      email: this.emailPredA ? this.emailPredA : this.preduzeceZaAzuriranje.email

    }

    if (p.password != this.preduzeceZaAzuriranje.password) {

      let izraz1 = /\W+/
      let izraz2 = /[A-Z]+/
      let izraz3 = /\d+/
      let izraz4 = /.{7,}/
      let izraz5 = /^[a-z,A-Z]/


      if (izraz1.test(p.password) == false ||
        izraz2.test(p.password) == false || izraz3.test(p.password)
        == false || izraz4.test(p.password) == false ||
        izraz5.test(p.password) == false) {
        this.mess1 = "not";
        this.porukaZaAzuriranje1 = " Pogrešan format lozinke."
      }

    }
    if (p.username != this.preduzeceZaAzuriranje.username) {

      this.servis.pretragaPredUsername(p.username).subscribe(data => {
        if (!data) {
          this.servis.pretragaPoljUsername(p.username).subscribe(data1 => {
            if (!data1) {
              this.servis.pretragaAdminUsername(p.username).subscribe(data2 => {
                if (!data2) {
                  this.servis.pretragaZahtevaUsername(p.username).subscribe(data3 => {
                    if (!data3) {
                      if (this.mess1 == 'ok') {
                        this.servis.obrisiPreduzece(this.preduzeceZaAzuriranje.username).subscribe(
                          data => {
                            this.servis.dodajPreduzece(p.ime, p.username, p.password,
                              p.datum, p.mesto, p.email).subscribe(data => {
                                this.preduzeceZaAzuriranje = data
                              })
                          }
                        );


                      }
                    }
                  })
                }
              })
            }
          })
        }
      })
    }



    else {
      if (this.mess1 == 'ok') {
        this.servis.obrisiPreduzece(this.preduzeceZaAzuriranje.username).subscribe();

        this.servis.dodajPreduzece(p.ime, p.username, p.password,
          p.datum, p.mesto, p.email).subscribe(data => {
            this.preduzeceZaAzuriranje = data

          })
      }
    }

  }
  oldPassword: string;
  newFirst: string;
  newSecond: string;
  old: string = ""

  messageZaPromenuLozinke: string = "";

  promeni() {

    this.messageZaPromenuLozinke = ''
    let izraz1 = /\W+/
    let izraz2 = /[A-Z]+/
    let izraz3 = /\d+/
    let izraz4 = /.{7,}/
    let izraz5 = /^[a-z,A-Z]/

    this.servis.pretragaAdminUsername(this.loggedInUser).subscribe(data => {
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
                  this.servis.obrisiAdmina(this.loggedInUser).subscribe(data => {
                    this.servis.dodajAdmina(this.loggedInUser, this.newFirst).subscribe(data => {// this.ulogovaniAdmin=data;
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

  zahtevati() {
    this.flagZaPrikaz = 0
  }

  dodati() {
    this.flagZaPrikaz = 1;
  }

  obrisati() {
    this.flagZaPrikaz = 2;
  }
  azurirati() {
    this.flagZaPrikaz = 3;
  }
  promeniti() {
    this.flagZaPrikaz = 4;
  }

  logOut() {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/login'])
  }

}



