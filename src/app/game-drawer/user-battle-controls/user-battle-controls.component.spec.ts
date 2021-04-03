import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBattleControlsComponent } from './user-battle-controls.component';

describe('UserBattleControlsComponent', () => {
  let component: UserBattleControlsComponent;
  let fixture: ComponentFixture<UserBattleControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserBattleControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBattleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
