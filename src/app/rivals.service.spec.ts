import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { RivalNames, Rivals } from './rivals';
import { RivalsService } from './rivals.service';
import { StreamDataService } from './stream-data.service';
import { User } from './user';
import { UserService } from './user.service';
import { delay } from 'rxjs/operators';

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('RivalsService', () => {
  let service: RivalsService;
  var streamDataSpy: jasmine.SpyObj<StreamDataService>;
  var userSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    streamDataSpy = jasmine.createSpyObj('StreamDataService', ['subscribe'])
    userSpy = jasmine.createSpyObj('userService', ['getUser'])
    TestBed.configureTestingModule({
      providers: [
        { provide: StreamDataService, useValue: streamDataSpy },
        { provide: UserService, useValue: userSpy },
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

  it('should lookup a rival with UserService', () => {
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
      }],
      behindRivals: [],
    };

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(oneRivalName)));
    userSpy.getUser.withArgs('bob').and.returnValue(of(bob));
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
      }],
      behindRivals: [{
        name: "bob",
        rivalGoldPerMinuteTotal: 3.5,
      }],
    };

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(twoRivalNames)));
    userSpy.getUser.withArgs('sue').and.returnValue(of(sue));
    userSpy.getUser.withArgs('bob').and.returnValue(of(bob));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual([twoRivals]);
  });

  it('should lookup multiple rivals and return results incrementally', () => {
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
        }],
        behindRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 3.5,
        }],
      },
      {
        aheadRivals: [{
          name: "sue",
          rivalGoldPerMinuteTotal: 3.75,
        }],
        behindRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 4.0,
        }],
      },
    ];

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(twoRivalNames)));
    userSpy.getUser.withArgs('sue').and.returnValue(of(sue));
    // Delay data from bob slightly.
    userSpy.getUser.withArgs('bob').and.returnValue(of(...bobs));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual(twoRivalsSeq);
  });
  
  it('should update rivals as UserService updates', () => {
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
        }],
        behindRivals: [],
      },
      {
        aheadRivals: [{
          name: "bob",
          rivalGoldPerMinuteTotal: 4.0,
        }],
        behindRivals: [],
      },
    ];

    streamDataSpy.subscribe.and.returnValue(of(JSON.stringify(oneRivalName)));
    userSpy.getUser.withArgs('bob').and.returnValue(of(...bobs));
    const rivals$ = service.getRivals("test_user");
    const observerSpy = subscribeSpyTo(rivals$);

    expect(observerSpy.getValues()).toEqual(oneRivalSeq);
  });
});
