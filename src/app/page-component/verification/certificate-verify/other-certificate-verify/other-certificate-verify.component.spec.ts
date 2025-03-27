import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCertificateVerifyComponent } from './other-certificate-verify.component';

describe('OtherCertificateVerifyComponent', () => {
  let component: OtherCertificateVerifyComponent;
  let fixture: ComponentFixture<OtherCertificateVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherCertificateVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherCertificateVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
