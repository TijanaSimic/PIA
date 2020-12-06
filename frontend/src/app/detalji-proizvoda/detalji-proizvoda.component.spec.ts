import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiProizvodaComponent } from './detalji-proizvoda.component';

describe('DetaljiProizvodaComponent', () => {
  let component: DetaljiProizvodaComponent;
  let fixture: ComponentFixture<DetaljiProizvodaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetaljiProizvodaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiProizvodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
