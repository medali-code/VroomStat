import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviSinistreComponent } from './suivi-sinistre.component';

describe('SuiviSinistreComponent', () => {
  let component: SuiviSinistreComponent;
  let fixture: ComponentFixture<SuiviSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
