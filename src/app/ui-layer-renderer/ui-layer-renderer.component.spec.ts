import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiLayerRendererComponent } from './ui-layer-renderer.component';

describe('UiLayerRendererComponent', () => {
  let component: UiLayerRendererComponent;
  let fixture: ComponentFixture<UiLayerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
