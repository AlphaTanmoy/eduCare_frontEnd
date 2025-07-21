import { TestBed } from '@angular/core/testing';

import { EpdfService } from './epdf.service';

describe('EpdfService', () => {
  let service: EpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
