import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEPdfComponent } from './view-e-pdf.component';

describe('ViewEPdfComponent', () => {
  let component: ViewEPdfComponent;
  let fixture: ComponentFixture<ViewEPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
