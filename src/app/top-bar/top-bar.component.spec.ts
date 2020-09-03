import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

import { TopBarComponent } from './top-bar.component';
import { BackendService } from '../backend.service';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let backendServiceSpy: jasmine.SpyObj<BackendService>;

  beforeEach(async(() => {
    backendServiceSpy = jasmine.createSpyObj('BackendService', ['getRegisteredUser']);
    const getRegisteredUserSpy = backendServiceSpy.getRegisteredUser.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ TopBarComponent ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: BackendService, useValue: backendServiceSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
