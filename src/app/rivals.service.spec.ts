import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, concat, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { subscribeSpyTo, autoUnsubscribe } from '@hirez_io/observer-spy';

import { RivalNames, Rivals } from './rivals';
import { RivalsService } from './rivals.service';
import { StreamDataService } from './stream-data.service';
import { User } from './user';
import { UserService } from './user.service';
import { BattleGpmService } from './battle-gpm.service';

autoUnsubscribe();

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('RivalsService', () => {
  let service: RivalsService;
  var streamDataSpy: jasmine.SpyObj<StreamDataService>;
  var userSpy: jasmine.SpyObj<UserService>;
  var battleGpmSpy: jasmine.SpyObj<BattleGpmService>;

  beforeEach(() => {
    streamDataSpy = jasmine.createSpyObj('StreamDataService', ['subscribe'])
    userSpy = jasmine.createSpyObj('UserService', ['getUser'])
    battleGpmSpy = jasmine.createSpyObj('BattleGpmService', ['getBattleGpm'])
    TestBed.configureTestingModule({
      providers: [
        { provide: StreamDataService, useValue: streamDataSpy },
        { provide: UserService, useValue: userSpy },
        { provide: BattleGpmService, useValue: battleGpmSpy },
      ]
    });
    service = TestBed.inject(RivalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should output nothing when it gets no rival names', () => {
    const emptyRivalNames: RivalNames = {
      aheadNames: [],
      behindNames: [],
    };
    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(emptyRivalNames)));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual([]);
  });

  it('should lookup a rival with UserService and ignore -1 battle GPM', () => {
    const oneRivalName: RivalNames = {
      aheadNames: ["bob"],
      behindNames: [],
    };
    const bob: User = {
      name: "bob",
      accumulatedGold: 100,
      gold: 90,
      goldPerMinuteSelf: 2.0,
      goldPerMinuteOthers: 1.5,
      inBattle: false,
      wave: [0],
      admin: false,
    };
    const oneRival: Rivals = {
      aheadRivals: [{
        name: "bob",
        rivalGoldPerMinuteTotal: 3.5,
        wave: [0],
        accumulatedGold: 100,
      }],
      behindRivals: [],
    };

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(oneRivalName)));
    userSpy.getUser.withArgs("bob").and.returnValue(of(bob));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "bob").and.returnValue(of(-1));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual([oneRival]);
  });

  it('should lookup a rival with UserService and use positive battle GPM', () => {
    const oneRivalName: RivalNames = {
      aheadNames: ["bob"],
      behindNames: [],
    };
    const bob: User = {
      name: "bob",
      accumulatedGold: 100,
      gold: 90,
      goldPerMinuteSelf: 2.0,
      goldPerMinuteOthers: 1.5,
      inBattle: false,
      wave: [0],
      admin: false,
    };
    const oneRival: Rivals = {
      aheadRivals: [{
        name: "bob",
        rivalGoldPerMinuteTotal: 3.5,
        wave: [0],
        accumulatedGold: 100,
        battleGoldPerMinute: 2.0,
      }],
      behindRivals: [],
    };

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(oneRivalName)));
    userSpy.getUser.withArgs("bob").and.returnValue(of(bob));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "bob").and.returnValue(of(2.0));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual([oneRival]);
  });

  it('should lookup multiple rivals with UserService', () => {
    const twoRivalNames: RivalNames = {
      aheadNames: ["sue"],
      behindNames: ["bob"],
    };
    const sue: User = {
      name: "sue",
      accumulatedGold: 110,
      gold: 90,
      goldPerMinuteSelf: 2.5,
      goldPerMinuteOthers: 1.25,
      inBattle: false,
      wave: [0, 1],
      admin: false,
    };
    const bob: User = {
      name: "bob",
      accumulatedGold: 100,
      gold: 90,
      goldPerMinuteSelf: 2.0,
      goldPerMinuteOthers: 1.5,
      inBattle: false,
      wave: [0],
      admin: false,
    };
    const twoRivals: Rivals = {
      aheadRivals: [{
        name: "sue",
        rivalGoldPerMinuteTotal: 3.75,
        wave: [0, 1],
        accumulatedGold: 110,
      }],
      behindRivals: [{
        name: "bob",
        rivalGoldPerMinuteTotal: 3.5,
        wave: [0],
        accumulatedGold: 100,
      }],
    };

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(twoRivalNames)));
    userSpy.getUser.withArgs('sue').and.returnValue(of(sue));
    userSpy.getUser.withArgs('bob').and.returnValue(of(bob));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "sue").and.returnValue(of(-1));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "bob").and.returnValue(of(-1));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual([twoRivals]);
  });

  it('should lookup multiple rivals and return results incrementally', fakeAsync(() => {
    const twoRivalNames: RivalNames = {
      aheadNames: ["sue"],
      behindNames: ["bob"],
    };
    const sue: User = {
      name: "sue",
      accumulatedGold: 110,
      gold: 90,
      goldPerMinuteSelf: 2.5,
      goldPerMinuteOthers: 1.25,
      inBattle: false,
      wave: [0, 1],
      admin: false,
    };
    const bobs: User[] = [
      {
        name: "bob",
        accumulatedGold: 100,
        gold: 90,
        goldPerMinuteSelf: 2.0,
        goldPerMinuteOthers: 1.5,
        inBattle: false,
        wave: [0],
        admin: false,
      },
      {
        name: "bob",
        accumulatedGold: 100,
        gold: 90,
        goldPerMinuteSelf: 2.0,
        goldPerMinuteOthers: 2.0,
        inBattle: false,
        wave: [0, 1],
        admin: false,
      },
    ];
    const twoRivalsSeq: Rivals[] = [
      {
        aheadRivals: [{
          name: "sue",
          rivalGoldPerMinuteTotal: 3.75,
          wave: [0, 1],
          accumulatedGold: 110,
        }],
        behindRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 3.5,
          wave: [0],
          accumulatedGold: 100,
        }],
      },
      {
        aheadRivals: [{
          name: "sue",
          rivalGoldPerMinuteTotal: 3.75,
          wave: [0, 1],
          accumulatedGold: 110,
        }],
        behindRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 4.0,
          wave: [0, 1],
          accumulatedGold: 100,
        }],
      },
    ];

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(twoRivalNames)));
    userSpy.getUser.withArgs('sue').and.returnValue(of(sue));
    const delayedBob: Observable<User> = of(bobs[1]).pipe(delay(10));
    userSpy.getUser.withArgs('bob').and.returnValue(concat(of(bobs[0]), delayedBob));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "sue").and.returnValue(of(-1));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "bob").and.returnValue(of(-1));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    tick(10);

    expect(observerSpy.getValues()).toEqual(twoRivalsSeq);
  }));
  
  it('should update rivals as UserService updates', fakeAsync(() => {
    const oneRivalName: RivalNames = {
      aheadNames: ["bob"],
      behindNames: [],
    };
    const bobs: User[] = [
      {
        name: "bob",
        accumulatedGold: 100,
        gold: 90,
        goldPerMinuteSelf: 2.0,
        goldPerMinuteOthers: 1.5,
        inBattle: false,
        wave: [0],
        admin: false,
      },
      {
        name: "bob",
        accumulatedGold: 100,
        gold: 90,
        goldPerMinuteSelf: 2.0,
        goldPerMinuteOthers: 2.0,
        inBattle: false,
        wave: [0, 1],
        admin: false,
      },
    ];
    const oneRivalSeq: Rivals[] = [
      {
        aheadRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 3.5,
          wave: [0],
          accumulatedGold: 100,
        }],
        behindRivals: [],
      },
      {
        aheadRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 4.0,
          wave: [0, 1],
          accumulatedGold: 100,
        }],
        behindRivals: [],
      },
    ];

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(oneRivalName)));
    const delayedBob: Observable<User> = of(bobs[1]).pipe(delay(10));
    userSpy.getUser.withArgs('bob').and.returnValue(concat(of(bobs[0]), delayedBob));
    battleGpmSpy.getBattleGpm.withArgs("test_user", "bob").and.returnValue(of(-1));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    tick(10);

    expect(observerSpy.getValues()).toEqual(oneRivalSeq);
  }));
});
