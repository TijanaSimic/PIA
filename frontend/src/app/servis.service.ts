import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zahtev } from './models/zahtev';

@Injectable({
  providedIn: 'root'
})
export class ServisService {

  constructor(private http:HttpClient) { }
  
  url='http://localhost:4000'

  dohvatiPoljoprivrednika(username,password):Observable<any> {
    const polj={
      username:username,
      password:password
    }
    return this.http.post<any>(`${this.url}/poljoprivrednik`,polj);
  }


  dohvatiPreduzece(username,password):Observable<any> {
    const pred={
      username:username,
      password:password
    }
    return this.http.post<any>(`${this.url}/preduzece`,pred);


  }

  dohvatiAdmina(username, password):Observable<any> {
    const admin={
      username:username,
      password:password
    }
    return this.http.post<any>(`${this.url}/admin`,admin);



  }

  zahtevi():Observable<Zahtev[]> {
    return this.http.get<Zahtev[]>(`${this.url}/zahtevi`)
  }

  dodajPoljoprivrednika(ime,prezime, username, password,datum,mesto,telefon,email):Observable<any> {
    const polj={
      ime:ime,
      prezime:prezime,
      username:username,
      password:password,
      datumRodjenja:datum,
      mestoRodjenja:mesto,
      telefon:telefon,
      email:email
    }
    return this.http.post<any>(`${this.url}/add/poljoprivrednik`,polj);
  }

  
  dodajAdmina(username,password):Observable<any> {
    let admin = {
      username:username,
      password:password
    }
    return this.http.post<any>(`${this.url}/add/admin`,admin);
  }

  obrisiZahtev(id):Observable<any>{
    return this.http.get(`${this.url}/delete/${id}`)

  }

  obrisiPoljoprivrednika(username):Observable<any> {
    return this.http.get(`${this.url}/poljoprivrednik/delete/${username}`)
  }

  
  obrisiPreduzece(username):Observable<any> {
    return this.http.get(`${this.url}/preduzece/delete/${username}`)
  }

  obrisiAdmina(username):Observable<any> {
    return this.http.get(`${this.url}/admin/delete/${username}`)
  }



  dodajZahtev(zahtev):Observable<any> {

    return this.http.post(`${this.url}/add/zahtev`,zahtev);
  }

  dodajPreduzece(naziv,username,password,datum,mesto,email):Observable<any> {
    const pred= {
      naziv:naziv,
      username:username,
      password:password,
      datumOsnivanja:datum,
      mestoPreduzeca:mesto,
      email:email
    }
    return this.http.post(`${this.url}/add/preduzece`,pred);
  }

  
  pretragaPoljUsername(username):Observable<any> {
    return this.http.get(`${this.url}/poljoprivrednik/${username}`)
  }

  pretragaPredUsername(username):Observable<any> {
    return this.http.get<any>(`${this.url}/preduzece/${username}`)
  }

  pretragaAdminUsername(username):Observable<any> {
    return this.http.get<any>(`${this.url}/admin/${username}`)
  }
  pretragaZahtevaUsername(username):Observable<any> {
    return this.http.get<any>(`${this.url}/zahtev/${username}`)
  }
  
  dohvatiSveNarudzbine(nazivPreduzeca):Observable<any> {
    return this.http.get(`${this.url}/sve/narudzbine/${nazivPreduzeca}`);
  }
  narudzbinePoljoprivrednika(proizvod,preduzece,poljoprivrednik):Observable<any> {

    let p={
      proizvod:proizvod,
      preduzece:preduzece,
      poljoprivrednik:poljoprivrednik
    }

    return this.http.post(`${this.url}/nar/polj`,p);
  }
  komentariPoljoprivrednika(proizvod,preduzece,poljoprivrednik):Observable<any> {

    let p={
      proizvod:proizvod,
      preduzece:preduzece,
      poljoprivrednik:poljoprivrednik
    }

    return this.http.post(`${this.url}/kom/polj`,p);
  }
  ocenePoljoprivrednika(proizvod,preduzece,poljoprivrednik):Observable<any> {

    let p={
      proizvod:proizvod,
      preduzece:preduzece,
      poljoprivrednik:poljoprivrednik
    }

    return this.http.post(`${this.url}/ocene/polj`,p);
  }
 

  dohvatiNarudzbineKojeNisuPoslate(nazivPreduzeca):Observable<any> {
    return this.http.get(`${this.url}/narudzbine/${nazivPreduzeca}`);
  }
  dohvatiPoslateNarudzbine(nazivPreduzeca):Observable<any> {
    return this.http.get(`${this.url}/narudzbine/poslate/${nazivPreduzeca}`);
  }

  obrisiNarudzbinu(naziv,poljoprivrednik,preduzece):Observable<any> {
    let p= {
      naziv:naziv,
      poljoprivrednik:poljoprivrednik,
      preduzece:preduzece
    }
    return this.http.post(`${this.url}/narudzbine/delete`, p)
  }

  koordinate(grad):Observable<any>
  {
    return this.http.get(`https://dev.virtualearth.net/REST/v1/Locations?locality=${grad}&maxResults=1&key=Agjom4cFqL5oFjpGNPAiUEAjFYmE15fOl4fhohQCK_w_bHi6ShYLgTkK7eWKT65P`)
}

  

  vremePutovanja(d1,s1,d2,s2,startTime):Observable<any>{
    return this.http.get(`https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${d1},${s1}&destinations=${d2},${s2}&travelMode=driving&startTime=${startTime}&key=Agjom4cFqL5oFjpGNPAiUEAjFYmE15fOl4fhohQCK_w_bHi6ShYLgTkK7eWKT65P`);
   

   
  }

dodajNarudzbinu(nar):Observable<any> {

  
  return this.http.post(`${this.url}/narudzbine/add`, nar)
}

obrisiN(id):Observable<any>{
  return this.http.get(`${this.url}/delete/nar/${id}`)
}

obrisiNpodIdstring(id): Observable<any>{
  return this.http.get(`${this.url}/narudzbine/delete/${id}`);
}



sviProizvodi():Observable<any> {
  return this.http.get(`${this.url}/prodavnica`)
}

dohvatiProizvode(usernamePreduzeca):Observable<any> {
  return this.http.get<any>(`${this.url}/proizvodi/${usernamePreduzeca}`)

} 

dohvatiKomentare(preduzece,naziv):Observable<any> {
  return this.http.get<any>(`${this.url}/komentari/${preduzece}/${naziv}`)
}
dohvatiOcene(preduzece,naziv):Observable<any> {
  return this.http.get<any>(`${this.url}/ocene/${preduzece}/${naziv}`)
}
 

dohvatiProizvod(preduzece,naziv):Observable<any> {
  return this.http.get<any>(`${this.url}/proizvodi/${preduzece}/${naziv}`)
}

dodajProizvodUProdavnicu(naziv,preduzece,kolicina,cena,vrsta, uputstvo,dani):Observable<any> {
  const p = {
   
    nazivProizvoda:naziv,
    preduzece:preduzece,
    kolicina:kolicina,
    cenaPoKomadu:cena,
    prosecnaOcena:null,
    vrsta:vrsta,
    uputstvo:uputstvo,
    ukupanBrojDana:dani
  } 
  return this.http.post<any>(`${this.url}/add/proizvod`,p);
}

obrisiProizvod(preduzece,naziv):Observable<any> {
  return this.http.get(`${this.url}/pr/delete/${preduzece}/${naziv}`)
}

azurirajProizvod(naziv,preduzece,kolicina,cena):Observable<any> {

  let p= {
    naziv:naziv,
    preduzece:preduzece,
    kolicina:kolicina,
    cena:cena
  }
  
  return this.http.post(`${this.url}/proizvod/azuriranje`, p)
}


dohvatiRasadnike(username):Observable<any> {
  return this.http.get<any>(`${this.url}/rasadnici/${username}`)

} 

dodajRasadnik(naziv,mesto,duzina,sirina,poljoprivrednik):Observable<any> {
  const p = {
    naziv:naziv,
    mesto:mesto,
    ukupanBrojSadnica:duzina*sirina,
    kolicinaVode:200,
    temperatura:18,
    poljoprivrednik:poljoprivrednik,
    duzina:duzina,
    sirina:sirina,
    datumOsnivanja:new Date(),
    poslednjeAzuriranje:new Date().getTime()
  } 
  return this.http.post<any>(`${this.url}/add/rasadnik`,p);
}

dodajKomentar(tekst,proizvod,preduzece,poljoprivrednik):Observable<any> {
  const p = {
    tekst:tekst,
    nazivProizvoda:proizvod,
    preduzece:preduzece,
    poljoprivrednik:poljoprivrednik
  } 
  return this.http.post<any>(`${this.url}/add/komentar`,p);
}

dodajOcenu(vrednost,proizvod,preduzece,poljoprivrednik):Observable<any> {
  const p = {
    vrednost:vrednost,
    nazivProizvoda:proizvod,
    preduzece:preduzece,
    poljoprivrednik:poljoprivrednik
  } 
  return this.http.post<any>(`${this.url}/add/ocena`,p);
}

tridesetDana(ime):Observable<any> {
  return this.http.get<any>(`${this.url}/hello/${ime}`)

} 

azurirajNarudzbinuStatus(p):Observable<any> {
   
  return this.http.post<any>(`${this.url}/nar/status`,p);
}

azurirajNarudzbinuDatum(id):Observable<any> {
  return this.http.get<any>(`${this.url}/nar/datum/${id}`)

}
azurirajNarudzbinuIdentifikator(id):Observable<any> {
  return this.http.get<any>(`${this.url}/nar/identif/${id}`)

}

azurirajKolicinuProizvoda(_id,kolicina):Observable<any> {
  let p= {
     _id:_id,
    kolicina:kolicina
  }
  return this.http.post(`${this.url}/pr/azuriranje/kolicina`, p)
}

azurirajRasadnikTemperatura(id,temp):Observable<any> {
   
    return this.http.get(`${this.url}/t/${id}/${temp}`)
}

azurirajRasadnikVoda(id,voda):Observable<any> {

  
  return this.http.get(`${this.url}/voda/${id}/${voda}`)
}

dohvatiRasadnik(id):Observable<any> {
  return this.http.get<any>(`${this.url}/rasadnici/id/${id}`)

} 
dohvatiSadniceRasadnika(id):Observable<any> {
  return this.http.get<any>(`${this.url}/sadniceRasadnika/${id}`)

} 

dohvatiSadnicuPoId(id):Observable<any> {
  return this.http.get<any>(`${this.url}/sadnica/${id}`)

} 

dohvatiSveIzMagacinaPoIdRasadnika(id):Observable<any> {
  return this.http.get<any>(`${this.url}/magacin/${id}`)

}
dohvatiPreparate(id):Observable<any> {
  return this.http.get<any>(`${this.url}/magacin/preparati/${id}`)

} 
dohvatiSadniceIzMagacina(id):Observable<any> {
  return this.http.get<any>(`${this.url}/magacin/sadnice/${id}`)

} 

azurirajSadnicuNapredovanje(id,napredovanje):Observable<any> {

 
  return this.http.get(`${this.url}/napredovanje/${id}/${napredovanje}`)
}
 

azurirajPreparatKolicina(id,kolicina):Observable<any> {
 
    return this.http.get(`${this.url}/pr/ko/${id}/${kolicina}`)
}
 
obrisiIzMagacina(id):Observable<any> {
  return this.http.get(`${this.url}/magacin/delete/${id}`)
}

obrisiIzSadnica(id):Observable<any> {
  return this.http.get(`${this.url}/sadnice/delete/${id}`)
}

dohvatiNarudzbinuZaMagacin(polj,mesto,naziv) :Observable<any> {

  let p= {
     poljoprivrednik:polj,
     mestoRasadnika:mesto,
     nazivRasadnika:naziv  }
  return this.http.post(`${this.url}/narudzbine/magacin`, p) }

dohvatiNarudzbineSaIstimIdentifikatoromiPolj(identifikator,polj) :Observable<any> {
  return this.http.get(`${this.url}/nar/istiid/${identifikator}/${polj}`)
}

dohvatiNarudzbineSaIstimIdentifikatoromiPred(identifikator,polj,pred) :Observable<any> {
  let p= {
    identifikator:identifikator,
    poljoprivrednik:polj,
    preduzece:pred
  }
  return this.http.post(`${this.url}/nid`,p)
}


 
poruka(rasadnik,email):Observable<any> {
  return this.http.get(`${this.url}/poruka/${rasadnik}/${email}`)
}
dodajSadnicu(p):Observable<any> {
  return this.http.post(`${this.url}/dodavanje/sadnice`,p)
}
azurirajSadnicuPoruka(id, poruka):Observable<any> {
  return this.http.get(`${this.url}/azurSadPor/${id}/${poruka}`);
}


azurirajNarStatusNaOsnovuIdentifikatora(p):Observable<any> {
   
  return this.http.post<any>(`${this.url}/nar/status/identifikator`,p);
}

dohvatiNarudzbinePoljoprivrednika(polj) :Observable<any> {
  return this.http.get(`${this.url}/nar/poljoprivrednik/${polj}`)
}

dodajNarudzbinuUMagacin(n):Observable<any> {
  return this.http.post(`${this.url}/add/magacin`,n)
}

dohvatiRasadnikNaOsnovuPoljNaziv(polj,naziv):Observable<any> {
  
  return this.http.get<any>(`${this.url}/r/${polj}/${naziv}`)
} 
preduzeca():Observable<any> {
  return this.http.get(`${this.url}/preduzeca`)
} 


sveNarudzbineJednogPolj(username):Observable<any> {
  return this.http.get<any>(`${this.url}/narpolj/${username}`)

} 
obrisiSveNarPoljIzMagacina(username):Observable<any>{
  return this.http.get(`${this.url}/delnarmag/${username}`)
}

obrisiSveRasadnikePolj(username):Observable<any>{
  return this.http.get(`${this.url}/delrasadnike/${username}`)
}
obrisiSveSadnicePolj(username):Observable<any>{
  return this.http.get(`${this.url}/delsadnice/${username}`)
}

dohvatiNarudzbinu(identifikator,polj):Observable<any> {
  return this.http.get(`${this.url}/dohvatiNar/${identifikator}/${polj}`)
} 

dohvatiZadnjiIdentifikator(polj):Observable<any> {
  return this.http.get(`${this.url}/max/${polj}`)
} 
obrisiSveProizvodePred(username):Observable<any>{
  return this.http.get(`${this.url}/delproizvode/${username}`)
}

obrisiSveNarudzbineJednogPred(username):Observable<any> {
  return this.http.get<any>(`${this.url}/narpred/${username}`)

} 

azurirajNarudzbinuKolicina(id,kol):Observable<any> {
  return this.http.get<any>(`${this.url}/nar/kol/${id}/${kol}`)

}

obrisiProizvodIzOcena(ime,preduzece) :Observable<any> {
  return this.http.get<any>(`${this.url}/delprocene/${ime}/${preduzece}`)

}

obrisiProizvodIzKomentara(ime,preduzece) :Observable<any> {
  return this.http.get<any>(`${this.url}/delprkomentari/${ime}/${preduzece}`)

}

obrisiSveOcenePreduzeca(username):Observable<any> {
  return this.http.get<any>(`${this.url}/delocene/${username}`)

}

obrisiSveKomPreduzeca(username):Observable<any> {
  return this.http.get<any>(`${this.url}/delkom/${username}`)

}

obrisiIzMagacinaPoIdRasadnika(idRasadnika):Observable<any> {
  return this.http.get<any>(`${this.url}/delmagacin/${idRasadnika}`)

}

 
}
