import { TestBed } from '@angular/core/testing';

import { BattlegroundStateService } from './battleground-state.service';

describe('BattlegroundStateService', () => {
  let service: BattlegroundStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattlegroundStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
