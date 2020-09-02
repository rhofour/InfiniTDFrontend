import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

import { AccountComponent } from './account.component';
import { BackendService } from '../backend.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let angularFireAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async(() => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getLoggedInUser']);
    const getLoggedInUserSpy = backendServiceSpy.getLoggedInUser.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ AccountComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: angularFireAuthSpy },
        { provide: BackendService, useValue: backendServiceSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
