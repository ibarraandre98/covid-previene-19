import { TestBed } from '@angular/core/testing';

import { BesttimeServiceService } from './besttime-service.service';

describe('BesttimeServiceService', () => {
  let service: BesttimeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BesttimeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
