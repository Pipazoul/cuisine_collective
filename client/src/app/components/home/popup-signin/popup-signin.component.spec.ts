import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSigninComponent } from './popup-signin.component';

describe('PopupSigninComponent', () => {
  let component: PopupSigninComponent;
  let fixture: ComponentFixture<PopupSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
