import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RendererComponent } from './renderer.component';
import { mockGameConfig } from '../mock-game-config';

describe('RendererComponent', () => {
  let component: RendererComponent;
  let fixture: ComponentFixture<RendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RendererComponent);
    component = fixture.componentInstance;
    // Set mandatory inputs.
    component.gameConfig = mockGameConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
