import { Component, OnInit } from '@angular/core';
import { ServisService } from '../servis.service';
import { Poljoprivrednik } from '../models/poljoprivrednik';
import { Router } from '@angular/router';
import { PreduzeceComponent } from '../preduzece/preduzece.component';
import { Preduzece } from '../models/preduzece';
import { Admin } from '../models/admin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 

  
  constructor(private servis:ServisService, private router:Router) { }

  ngOnInit(): void {

 /*   localStorage.setItem(`peraidentifikator`, JSON.stringify(0))
    localStorage.setItem(`zikaidentifikator`, JSON.stringify(0))
    localStorage.setItem(`mikaaidentifikator`, JSON.stringify(0))
    localStorage.setItem(`VA`, JSON.stringify(5));
    localStorage.setItem(`VP`, JSON.stringify(5));
    localStorage.setItem(`PP`, JSON.stringify(5));*/

  }

  username:string;
  password:string;

  tip:string;


  preduzece:Preduzece;
  admin:Admin;

  message:string="";


  login() {
 
    if(this.tip=='poljoprivrednik'){
      
      
      this.servis.dohvatiPoljoprivrednika(this.username,this.password).subscribe(data =>{
      
        if(data) { 
          localStorage.setItem('loggedUser',JSON.stringify(this.username));
      this.router.navigate(['/poljoprivrednik']); }
      else {
        this.servis.pretragaZahtevaUsername(this.username).subscribe(data1 => {
          if(!data1) this.message="Unesite ponovo podatke." 
          else 
          this.message="Vas zahtev je poslat adminu na odobrenje."
        })
       
  }
    })
    
      
      }

    else if(this.tip=='preduzece') {
      this.servis.dohvatiPreduzece(this.username,this.password).subscribe(data =>{
        
        if(data) {
          localStorage.setItem('loggedUser',JSON.stringify(this.username));
      this.router.navigate(['/preduzece']); }
      else {
        this.servis.pretragaZahtevaUsername(this.username).subscribe(data1 => {
          if(!data1) this.message="Unesite ponovo podatke." 
          else 
          this.message="Vas zahtev je poslat adminu na odobrenje."
        })
       
  }
    
    
    }); 

    
    }
    else if(this.tip=='admin') { 
      this.servis.dohvatiAdmina(this.username,this.password).subscribe(data => {
      this.admin=data;
      if(this.admin) {
        localStorage.setItem('loggedUser',JSON.stringify(this.username));
      this.router.navigate(['/admin']) }
      else 
      this.message="Unesite ponovo podatke."
    });
  }
  else {
     
    this.message="Unesite ponovo podatke."
  }
}
 


}
