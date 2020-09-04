import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';

import { SelectionService, Selection, NewBuildSelection, GridSelection } from './selection.service';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfigService } from './game-config.service';
import { mockGameConfig, mockTowerConfigWithImg } from './mock-game-config';
import { mockBattlegroundState } from './mock-battleground-state';

describe('SelectionService', () => {
  let service: SelectionService;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let battlegroundStateServiceSpy: jasmine.SpyObj<BattlegroundStateService>;
  let gameConfigServiceSpy: jasmine.SpyObj<GameConfigService>;

  beforeEach(() => {
    gameConfigServiceSpy = jasmine.createSpyObj('GameConfigService', ['getConfig']);
    const getConfigSpy = gameConfigServiceSpy.getConfig.and.returnValue(of(mockGameConfig));
    battlegroundStateServiceSpy = jasmine.createSpyObj('BattlegroundStateService', ['getBattlegroundState']);
    const getBattlegroundStateSpy = battlegroundStateServiceSpy.getBattlegroundState.and.returnValue(of(mockBattlegroundState));

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
    service.setUsername('test-user');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('build selection from nothing works', () => {
    const newSelection = new NewBuildSelection(0);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(mockTowerConfigWithImg, undefined, undefined);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('build unselection from nothing works', () => {
    const newSelection = new NewBuildSelection(0);
    service.updateSelection(newSelection);
    service.updateSelection(newSelection);

    service.getSelection().subscribe(
      selection => expect(selection).toEqual(new Selection(), 'empty selection'),
      fail
    );
  });
});
