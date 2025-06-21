import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadExcelToGenerateCertificateComponent } from './download-excel-to-generate-certificate.component';

describe('DownloadExcelToGenerateCertificateComponent', () => {
  let component: DownloadExcelToGenerateCertificateComponent;
  let fixture: ComponentFixture<DownloadExcelToGenerateCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadExcelToGenerateCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadExcelToGenerateCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
