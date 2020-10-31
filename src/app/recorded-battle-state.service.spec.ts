import { TestBed } from '@angular/core/testing';

import { RecordedBattleStateService } from './recorded-battle-state.service';

describe('RecordedBattleStateService', () => {
  let service: RecordedBattleStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordedBattleStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
