import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import Konva from 'konva';

import { BackgroundLayerRendererComponent } from './background-layer-renderer.component';
import { SelectionService } from '../selection.service';
import { mockGameConfig } from '../mock-game-config';

describe('BackgroundLayerRendererComponent', () => {
  let component: BackgroundLayerRendererComponent;
  let fixture: ComponentFixture<BackgroundLayerRendererComponent>;
  let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
  let stageSpy: jasmine.SpyObj<Konva.Stage>;

  beforeEach(async(() => {
    stageSpy = jasmine.createSpyObj('Konva.Stage', ['add']);

    TestBed.configureTestingModule({
      declarations: [ BackgroundLayerRendererComponent ],
      providers: [
        { provide: SelectionService, useValue: selectionServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayerRendererComponent);
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
