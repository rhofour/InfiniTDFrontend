import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import Konva from 'konva';

import { TowerLayerRendererComponent } from './tower-layer-renderer.component';
import { BackendService } from '../backend.service';
import { mockGameConfig } from '../mock-game-config';

describe('TowerLayerRendererComponent', () => {
  let component: TowerLayerRendererComponent;
  let fixture: ComponentFixture<TowerLayerRendererComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;
  let stageSpy: jasmine.SpyObj<Konva.Stage>;

  beforeEach(async(() => {
    stageSpy = jasmine.createSpyObj('Konva.Stage', ['add']);

    TestBed.configureTestingModule({
      declarations: [ TowerLayerRendererComponent ],
      providers: [
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TowerLayerRendererComponent);
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
