import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewvehiculeComponent } from './newvehicule.component';

describe('NewvehiculeComponent', () => {
  let component: NewvehiculeComponent;
  let fixture: ComponentFixture<NewvehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewvehiculeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewvehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
