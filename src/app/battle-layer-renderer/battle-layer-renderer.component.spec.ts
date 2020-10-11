import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import Konva from 'konva';

import { BattleLayerRendererComponent } from './battle-layer-renderer.component';
import { mockGameConfig } from '../mock-game-config';

describe('BattleLayerRendererComponent', () => {
  let component: BattleLayerRendererComponent;
  let fixture: ComponentFixture<BattleLayerRendererComponent>;
  let stageSpy: jasmine.SpyObj<Konva.Stage>;

  beforeEach(async(() => {
    stageSpy = jasmine.createSpyObj('Konva.Stage', ['add']);

    TestBed.configureTestingModule({
      declarations: [ BattleLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleLayerRendererComponent);
    component = fixture.componentInstance;
    // Set mandatory inputs.
    component.stage = stageSpy;
    component.gameConfig = mockGameConfig;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
