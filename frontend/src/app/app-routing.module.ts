import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistracijaPoljoprivrednikComponent } from './registracija-poljoprivrednik/registracija-poljoprivrednik.component';
import { RegistracijaPreduzeceComponent } from './registracija-preduzece/registracija-preduzece.component';
import { PoljoprivrednikComponent } from './poljoprivrednik/poljoprivrednik.component';
import { PreduzeceComponent } from './preduzece/preduzece.component';
import { AdminComponent } from './admin/admin.component';
import { ProizvodiComponent } from './proizvodi/proizvodi.component';
import { DetaljiProizvodaComponent } from './detalji-proizvoda/detalji-proizvoda.component';
import { StepsComponent } from './steps/steps.component';
import { ProdavnicaComponent } from './prodavnica/prodavnica.component';
import { VizuelniPrikazComponent } from './vizuelni-prikaz/vizuelni-prikaz.component';
  

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'registracijaPoljoprivrednik',component:RegistracijaPoljoprivrednikComponent},
  {path:'registracijaPreduzece', component:RegistracijaPreduzeceComponent},
  {path:'', component:LoginComponent},
  {path:'poljoprivrednik', component:PoljoprivrednikComponent},
  {path:'preduzece', component:PreduzeceComponent},
  {path:'admin',component:AdminComponent},
  {path:'proizvodi', component:ProizvodiComponent},
  {path:'detalji', component:DetaljiProizvodaComponent},
  {path:'steps', component:StepsComponent},
  {path:'prodavnica',component:ProdavnicaComponent},
  {path:'vizuelniPrikaz', component:VizuelniPrikazComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
