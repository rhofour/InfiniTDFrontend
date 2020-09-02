import { TestBed } from '@angular/core/testing';

import { GameConfigService } from './game-config.service';
import { BackendService } from './backend.service';
import { mockGameConfigData } from './mock-game-config';

describe('GameConfigService', () => {
  let service: GameConfigService;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(() => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getGameConfig']);
    backendServiceSpy.getGameConfig.and.returnValue(Promise.resolve(mockGameConfigData));

    TestBed.configureTestingModule({
      providers: [
        GameConfigService,
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    });
    service = TestBed.inject(GameConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
