import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorEditionComponent } from './contributor-edition.component';

describe('ContributorEditionComponent', () => {
  let component: ContributorEditionComponent;
  let fixture: ComponentFixture<ContributorEditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContributorEditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
