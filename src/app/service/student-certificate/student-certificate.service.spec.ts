import { TestBed } from '@angular/core/testing';

import { StudentCertificateService } from './student-certificate.service';

describe('StudentCertificateService', () => {
  let service: StudentCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
