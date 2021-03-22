import { TestBed } from '@angular/core/testing';

import { BattleGpmService } from './battle-gpm.service';

describe('BattleGpmService', () => {
  let service: BattleGpmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleGpmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
