import { TestBed } from '@angular/core/testing';

import { ToplevelUsersService } from './toplevel-users.service';

describe('ToplevelUsersService', () => {
  let service: ToplevelUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToplevelUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
