import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of } from 'rxjs';

import { LeaderboardComponent } from './leaderboard.component';
import { BackendService } from '../backend.service';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async(() => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getUsers']);
    backendServiceSpy.getUsers.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ LeaderboardComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
