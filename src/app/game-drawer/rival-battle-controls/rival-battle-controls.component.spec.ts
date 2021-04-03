import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RivalBattleControlsComponent } from './rival-battle-controls.component';

describe('RivalBattleControlsComponent', () => {
  let component: RivalBattleControlsComponent;
  let fixture: ComponentFixture<RivalBattleControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RivalBattleControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RivalBattleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
