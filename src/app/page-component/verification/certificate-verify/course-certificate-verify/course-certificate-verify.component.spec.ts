import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCertificateVerifyComponent } from './course-certificate-verify.component';

describe('CourseCertificateVerifyComponent', () => {
  let component: CourseCertificateVerifyComponent;
  let fixture: ComponentFixture<CourseCertificateVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCertificateVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCertificateVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
