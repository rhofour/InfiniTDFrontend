import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDrawerComponent } from './game-drawer.component';

describe('GameDrawerComponent', () => {
  let component: GameDrawerComponent;
  let fixture: ComponentFixture<GameDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
