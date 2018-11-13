import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekDaySelectorComponent } from './week-day-selector.component';

describe('WeekDaySelectorComponent', () => {
  let component: WeekDaySelectorComponent;
  let fixture: ComponentFixture<WeekDaySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekDaySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekDaySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
