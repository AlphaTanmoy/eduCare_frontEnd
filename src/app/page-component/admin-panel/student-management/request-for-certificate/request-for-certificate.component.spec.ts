import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForCertificateComponent } from './request-for-certificate.component';

describe('RequestForCertificateComponent', () => {
  let component: RequestForCertificateComponent;
  let fixture: ComponentFixture<RequestForCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestForCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestForCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
