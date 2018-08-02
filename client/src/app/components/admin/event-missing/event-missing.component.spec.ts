import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMissingComponent } from './event-missing.component';

describe('EventMissingComponent', () => {
  let component: EventMissingComponent;
  let fixture: ComponentFixture<EventMissingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventMissingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventMissingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
