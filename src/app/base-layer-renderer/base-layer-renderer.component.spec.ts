import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseLayerRendererComponent } from './base-layer-renderer.component';

describe('BaseLayerRendererComponent', () => {
  let component: BaseLayerRendererComponent;
  let fixture: ComponentFixture<BaseLayerRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseLayerRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
