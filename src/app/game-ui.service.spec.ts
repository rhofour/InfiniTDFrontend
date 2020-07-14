import { TestBed } from '@angular/core/testing';

import { GameUiService } from './game-ui.service';

describe('GameUiService', () => {
  let service: GameUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
