import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TowerLayerRendererComponent } from './tower-layer-renderer.component';

describe('TowerLayerRendererComponent', () => {
  let component: TowerLayerRendererComponent;
  let fixture: ComponentFixture<TowerLayerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TowerLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TowerLayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
