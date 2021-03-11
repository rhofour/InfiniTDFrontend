import { TestBed } from '@angular/core/testing';

import { RivalsService } from './rivals.service';

describe('RivalsService', () => {
  let service: RivalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RivalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
