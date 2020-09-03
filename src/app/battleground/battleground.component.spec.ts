import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BattlegroundComponent } from './battleground.component';
import { BackendService } from '../backend.service';
import { mockGameConfigData } from '../mock-game-config';

describe('BattlegroundComponent', () => {
  let component: BattlegroundComponent;
  let fixture: ComponentFixture<BattlegroundComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async(() => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getGameConfig']);
    const getGameConfigSpy = backendServiceSpy.getGameConfig.and.returnValue(Promise.resolve(mockGameConfigData));

    TestBed.configureTestingModule({
      declarations: [ BattlegroundComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlegroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
