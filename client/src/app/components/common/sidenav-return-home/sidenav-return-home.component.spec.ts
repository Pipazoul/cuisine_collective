import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavReturnHomeComponent } from './sidenav-return-home.component';

describe('SidenavReturnHomeComponent', () => {
  let component: SidenavReturnHomeComponent;
  let fixture: ComponentFixture<SidenavReturnHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavReturnHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavReturnHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
