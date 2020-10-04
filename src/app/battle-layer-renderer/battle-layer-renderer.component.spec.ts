import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleLayerRendererComponent } from './battle-layer-renderer.component';

describe('BattleLayerRendererComponent', () => {
  let component: BattleLayerRendererComponent;
  let fixture: ComponentFixture<BattleLayerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleLayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
