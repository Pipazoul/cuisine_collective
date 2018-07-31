import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLocationTypeComponent } from './event-location-type.component';

describe('EventLocationTypeComponent', () => {
  let component: EventLocationTypeComponent;
  let fixture: ComponentFixture<EventLocationTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLocationTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLocationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
