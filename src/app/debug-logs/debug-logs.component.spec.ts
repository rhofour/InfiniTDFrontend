import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugLogsComponent } from './debug-logs.component';

describe('DebugLogsComponent', () => {
  let component: DebugLogsComponent;
  let fixture: ComponentFixture<DebugLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
