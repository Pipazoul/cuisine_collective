import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorServicesComponent } from './contributor-services.component';

describe('ContributorServicesComponent', () => {
  let component: ContributorServicesComponent;
  let fixture: ComponentFixture<ContributorServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
