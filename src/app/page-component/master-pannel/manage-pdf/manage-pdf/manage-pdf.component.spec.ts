import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePdfComponent } from './manage-pdf.component';

describe('ManagePdfComponent', () => {
  let component: ManagePdfComponent;
  let fixture: ComponentFixture<ManagePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
