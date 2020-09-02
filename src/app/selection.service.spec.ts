import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';

import { SelectionService } from './selection.service';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfigService } from './game-config.service';
import { mockGameConfig } from './mock-game-config';

describe('SelectionService', () => {
  let service: SelectionService;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let battlegroundStateServiceSpy: jasmine.SpyObj<BattlegroundStateService>;
  let gameConfigServiceSpy: jasmine.SpyObj<GameConfigService>;

  beforeEach(() => {
    gameConfigServiceSpy = jasmine.createSpyObj('GameConfigService', ['getConfig']);
    const getConfigSpy = gameConfigServiceSpy.getConfig.and.returnValue(of(mockGameConfig));

    TestBed.configureTestingModule({
      providers: [
        SelectionService,
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: BattlegroundStateService, useValue: battlegroundStateServiceSpy },
        { provide: GameConfigService, useValue: gameConfigServiceSpy },
      ],
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(SelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
