import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayedTowerComponent } from './displayed-tower.component';

describe('DisplayedTowerComponent', () => {
  let component: DisplayedTowerComponent;
  let fixture: ComponentFixture<DisplayedTowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayedTowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayedTowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
