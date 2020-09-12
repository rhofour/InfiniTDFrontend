import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { GameDrawerComponent } from './game-drawer.component';
import { SelectionService, Selection } from '../selection.service';
import { BackendService } from '../backend.service';
import { mockUser } from '../mock-user';

describe('GameDrawerComponent', () => {
  let component: GameDrawerComponent;
  let fixture: ComponentFixture<GameDrawerComponent>;
  let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async(() => {
    selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['getSelection']);
    const getSelectionSpy = selectionServiceSpy.getSelection.and.returnValue(of(new Selection()));
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getLoggedInUser']);
    const getLoggedInUserSpy = backendServiceSpy.getLoggedInUser.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ GameDrawerComponent ],
      providers: [
        { provide: SelectionService, useValue: selectionServiceSpy },
        { provide: MatSnackBar, useValue: matSnackBarSpy },
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDrawerComponent);
    component = fixture.componentInstance;
    // Set mandatory inputs.
    component.user = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
