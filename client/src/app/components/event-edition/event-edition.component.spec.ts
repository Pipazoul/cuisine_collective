import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditionComponent } from './event-edition.component';

describe('EventEditionComponent', () => {
  let component: EventEditionComponent;
  let fixture: ComponentFixture<EventEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
