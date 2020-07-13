import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundLayerRendererComponent } from './background-layer-renderer.component';

describe('BackgroundLayerRendererComponent', () => {
  let component: BackgroundLayerRendererComponent;
  let fixture: ComponentFixture<BackgroundLayerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundLayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
