import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import Konva from 'konva';
import { of } from 'rxjs';

import { UiLayerRendererComponent } from './ui-layer-renderer.component';
import { SelectionService, Selection } from '../selection.service';

describe('UiLayerRendererComponent', () => {
  let component: UiLayerRendererComponent;
  let fixture: ComponentFixture<UiLayerRendererComponent>;
  let stageSpy: jasmine.SpyObj<Konva.Stage>;
  let selectionServiceSpy: jasmine.SpyObj<SelectionService>;

  beforeEach(async(() => {
    stageSpy = jasmine.createSpyObj('Konva.Stage', ['add']);
    selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['getSelection']);
    const getSelectionSpy = selectionServiceSpy.getSelection.and.returnValue(of(new Selection()));

    TestBed.configureTestingModule({
      declarations: [ UiLayerRendererComponent ],
      providers: [
        { provide: SelectionService, useValue: selectionServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLayerRendererComponent);
    component = fixture.componentInstance;
    // Set mandatory inputs.
    component.stage = stageSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
