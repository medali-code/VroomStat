import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarerSinistreComponent } from './declarer-sinistre.component';

describe('DeclarerSinistreComponent', () => {
  let component: DeclarerSinistreComponent;
  let fixture: ComponentFixture<DeclarerSinistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclarerSinistreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarerSinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
