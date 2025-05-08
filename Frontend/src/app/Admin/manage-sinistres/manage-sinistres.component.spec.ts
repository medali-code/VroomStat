import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSinistresComponent } from './manage-sinistres.component';

describe('ManageSinistresComponent', () => {
  let component: ManageSinistresComponent;
  let fixture: ComponentFixture<ManageSinistresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSinistresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSinistresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
