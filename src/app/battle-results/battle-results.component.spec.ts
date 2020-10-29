import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleResultsComponent } from './battle-results.component';

describe('BattleResultsComponent', () => {
  let component: BattleResultsComponent;
  let fixture: ComponentFixture<BattleResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BattleResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
