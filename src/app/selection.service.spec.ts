import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';

import { SelectionService, Selection, NewBuildSelection, GridSelection } from './selection.service';
import { BattlegroundStateService } from './battleground-state.service';
import { GameConfigService } from './game-config.service';
import { mockGameConfig, mockTowerConfigWithImg0, mockTowerConfigWithImg1 } from './mock-game-config';
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

    const expectedSelection = new Selection(mockTowerConfigWithImg0, undefined, undefined);
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

  it('build selection removes gridTower selection', () => {
    const initialSelection = new GridSelection(0, 1);
    service.updateSelection(initialSelection);

    const newSelection = new NewBuildSelection(0);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(mockTowerConfigWithImg0, undefined, undefined);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('build selection doesn\'t remove empty grid selection', () => {
    const initialSelection = new GridSelection(2, 2);
    service.updateSelection(initialSelection);

    const newSelection = new NewBuildSelection(0);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(mockTowerConfigWithImg0, undefined, initialSelection);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('empty grid selection from nothing works', () => {
    const newSelection = new GridSelection(0, 0);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(undefined, undefined, newSelection);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('empty grid unselection from nothing works', () => {
    const newSelection = new GridSelection(0, 0);
    service.updateSelection(newSelection);
    service.updateSelection(newSelection);

    service.getSelection().subscribe(
      selection => expect(selection).toEqual(new Selection()),
      fail
    );
  });

  it('non-empty grid selection from nothing works', () => {
    const newSelection = new GridSelection(0, 1);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(undefined, mockTowerConfigWithImg0, newSelection);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('non-empty grid unselection from nothing works', () => {
    const newSelection = new GridSelection(0, 1);
    service.updateSelection(newSelection);
    service.updateSelection(newSelection);

    service.getSelection().subscribe(
      selection => expect(selection).toEqual(new Selection()),
      fail
    );
  });

  it('non-empty grid selection keeps matching build selection', () => {
    const initialSelection = new NewBuildSelection(0);
    service.updateSelection(initialSelection);

    const newSelection = new GridSelection(0, 1);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(mockTowerConfigWithImg0, mockTowerConfigWithImg0, newSelection);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('non-empty grid unselection keeps matching build selection', () => {
    const initialSelection = new NewBuildSelection(0);
    service.updateSelection(initialSelection);

    const newSelection = new GridSelection(0, 1);
    service.updateSelection(newSelection);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(mockTowerConfigWithImg0, undefined, undefined);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });

  it('non-empty grid selection drops non-matching build selection', () => {
    const initialSelection = new NewBuildSelection(0);
    service.updateSelection(initialSelection);

    const newSelection = new GridSelection(1, 1);
    service.updateSelection(newSelection);

    const expectedSelection = new Selection(undefined, mockTowerConfigWithImg1, newSelection);
    service.getSelection().subscribe(
      selection => expect(selection).toEqual(expectedSelection),
      fail
    );
  });
});
