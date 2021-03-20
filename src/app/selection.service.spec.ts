import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';

import { SelectionService } from './selection.service';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfigService } from './game-config.service';
import { mockGameConfig, mockTowerConfig0, mockTowerConfig1 } from './mock-game-config';
import { mockBattlegroundState } from './mock-battleground-state';
import { BattlegroundSelection } from './battleground-selection';

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
    service.updateBuildTowerSelection(0);

    service.getBuildTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
  });

  it('build selection removes battleground selection', () => {
    service.toggleBattlegroundSelection(false, 0, 1);

    // Select a tower that doesn't match the battleground selection.
    // See: mockBattlegroundSelection
    service.updateBuildTowerSelection(0);

    service.getBuildTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
  });

  it('build selection doesn\'t remove empty grid selection', () => {
    service.toggleBattlegroundSelection(false, 2, 2);

    service.updateBuildTowerSelection(0);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    expectedBgSelection.toggle(false, 2, 2);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
  });

  it('empty grid selection from nothing works', () => {
    service.toggleBattlegroundSelection(false, 0, 0);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    expectedBgSelection.toggle(false, 0, 0);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
  });

  it('non-empty grid selection from nothing works', () => {
    service.toggleBattlegroundSelection(false, 0, 1);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    expectedBgSelection.toggle(false, 0, 1);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
    service.getBuildTower().subscribe(
      selection => expect(selection).toBeUndefined(),
      fail
    );
    service.getDisplayedTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
  });

  it('non-empty grid unselection from nothing works', () => {
    service.toggleBattlegroundSelection(false, 0, 1);
    service.toggleBattlegroundSelection(false, 0, 1);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
    service.getBuildTower().subscribe(
      selection => expect(selection).toBeUndefined(),
      fail
    );
    service.getDisplayedTower().subscribe(
      selection => expect(selection).toBeUndefined(),
      fail
    );
  });

  it('non-empty grid selection keeps matching build selection', () => {
    service.updateBuildTowerSelection(0);
    service.toggleBattlegroundSelection(false, 0, 1);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    expectedBgSelection.toggle(false, 0, 1);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
    service.getBuildTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
    service.getDisplayedTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
  });

  it('non-empty grid unselection keeps matching build selection', () => {
    service.updateBuildTowerSelection(0);
    service.toggleBattlegroundSelection(false, 0, 1);
    service.toggleBattlegroundSelection(false, 0, 1);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
    service.getBuildTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
    service.getDisplayedTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig0),
      fail
    );
  });

  it('non-empty grid selection drops non-matching build selection', () => {
    service.updateBuildTowerSelection(0);
    service.toggleBattlegroundSelection(false, 1, 1);

    const expectedBgSelection = new BattlegroundSelection(3, 4);
    expectedBgSelection.toggle(false, 1, 1);
    service.getBattleground().subscribe(
      selection => expect(selection).toEqual(expectedBgSelection.getView()),
      fail
    );
    service.getBuildTower().subscribe(
      selection => expect(selection).toBeUndefined(),
      fail
    );
    service.getDisplayedTower().subscribe(
      selection => expect(selection).toEqual(mockTowerConfig1),
      fail
    );
  });
});
