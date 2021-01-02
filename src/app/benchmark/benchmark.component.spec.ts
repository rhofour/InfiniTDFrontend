import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BenchmarkComponent } from './benchmark.component';

describe('BenchmarkComponent', () => {
  let component: BenchmarkComponent;
  let fixture: ComponentFixture<BenchmarkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
