import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistracijaPoljoprivrednikComponent } from './registracija-poljoprivrednik/registracija-poljoprivrednik.component';
import { RegistracijaPreduzeceComponent } from './registracija-preduzece/registracija-preduzece.component';
import {FormsModule} from '@angular/forms'
import {RecaptchaModule} from 'ng-recaptcha';
import { ServisService } from './servis.service';
import {HttpClientModule} from '@angular/common/http';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { AdminComponent } from './admin/admin.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { DetaljiProizvodaComponent } from './detalji-proizvoda/detalji-proizvoda.component';
import { StepsComponent } from './steps/steps.component'
import {ChartsModule} from 'ng2-charts';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { VizuelniPrikazComponent } from './vizuelni-prikaz/vizuelni-prikaz.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatDialogModule} from '@angular/material/dialog';
import { DijalogComponent } from './dijalog/dijalog.component'
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  entryComponents:[DijalogComponent],
  declarations: [
    AppComponent,
    LoginComponent,
    RegistracijaPoljoprivrednikComponent,
    RegistracijaPreduzeceComponent,
    PoljoprivrednikComponent,
    PreduzeceComponent,
    AdminComponent,
    ProizvodiComponent,
    DetaljiProizvodaComponent,
    StepsComponent,
    ProdavnicaComponent,
    VizuelniPrikazComponent,
    DijalogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RecaptchaModule,
    HttpClientModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatProgressBarModule
  ], 
  providers: [ServisService],
  bootstrap: [AppComponent]
})
export class AppModule { } 
  
  