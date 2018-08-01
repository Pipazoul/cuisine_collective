import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventContributorsComponent } from './event-contributors.component';

describe('EventContributorsComponent', () => {
  let component: EventContributorsComponent;
  let fixture: ComponentFixture<EventContributorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventContributorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
