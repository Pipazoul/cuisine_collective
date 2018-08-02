import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { AbstractEventModifier } from '../../../abstract/abstract-event-modifier';
import { EventService } from '../../../services/event.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { ContributorService } from '../../../services/contributor.service';
import { ContributorClass } from '../../../domain/contributor.class';
import { MatSelectChange } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-event-contributors',
  templateUrl: './event-contributors.component.html',
  styleUrls: ['./event-contributors.component.css']
})
export class EventContributorsComponent extends AbstractEventModifier implements OnInit, OnChanges {

  public eventContributorsForm: FormGroup;
  public contributors: ContributorGroups = { location: [], food: [], skills: [], people: [], assistants: [] };

  constructor(@Inject(EventService) eventService: EventService,
    private contributorService: ContributorService) {
    super(eventService);
  }

  ngOnInit() {
    this.initForm();
    this.loadContributors();
  }

  ngOnChanges() {
    this.initForm();
    this.loadContributors();
  }

  private initForm() {
    this.eventContributorsForm = new FormGroup({
      'location': new FormArray(this.event.contributorsLocation.map(c => new FormControl(c))),
      'food': new FormArray(this.event.contributorsFood.map(c => new FormControl(c))),
      'skills': new FormArray(this.event.contributorsSkills.map(c => new FormControl(c))),
      'people': new FormArray(this.event.contributorsPeople.map(c => new FormControl(c))),
      'assistants': new FormArray(this.event.contributorsAssistants.map(c => new FormControl(c)))
    });
  }

  /**
   * Load contributors and dispatch them to lists
   */
  private loadContributors() {
    this.contributorService.getAll().subscribe((contributors) => {
      this.dispatchToLists(contributors);
    });
  }

  /**
   * Dispatch contributors to lists, based on their attributes,
   * only if they are not already in corresponding event's contributors list
   * 
   * @param contributors
   */
  private dispatchToLists(contributors: ContributorClass[]) {
    contributors.forEach((c) => {
      if (c.location && !this.event.contributorsLocation.some((ec) => ec.id === c.id)) {
        this.contributors.location.push(c);
      }
      if (c.food && !this.event.contributorsFood.some((ec) => ec.id === c.id)) {
        this.contributors.food.push(c);
      }
      if (c.skills && !this.event.contributorsPeople.some((ec) => ec.id === c.id)) {
        this.contributors.skills.push(c);
      }
      if (c.people && !this.event.contributorsPeople.some((ec) => ec.id === c.id)) {
        this.contributors.people.push(c);
      }
      if (c.assistants && !this.event.contributorsAssistants.some((ec) => ec.id === c.id)) {
        this.contributors.assistants.push(c);
      }
    });
  }

  public addContributorLocation(contributor: ContributorClass) {
    this.addContributor(contributor, this.eventContributorsForm.get('location') as FormArray, this.contributors.location);
  }

  public addContributorFood(contributor: ContributorClass) {
    this.addContributor(contributor, this.eventContributorsForm.get('food') as FormArray, this.contributors.food);
  }

  public addContributorSkills(contributor: ContributorClass) {
    this.addContributor(contributor, this.eventContributorsForm.get('skills') as FormArray, this.contributors.skills);
  }

  public addContributorPeople(contributor: ContributorClass) {
    this.addContributor(contributor, this.eventContributorsForm.get('people') as FormArray, this.contributors.people);
  }

  public addContributorAssistants(contributor: ContributorClass) {
    this.addContributor(contributor, this.eventContributorsForm.get('assistants') as FormArray, this.contributors.assistants);
  }

  /**
   * When a contributors is selected in a given list, add the contributor to the form and remove it from the corresponding contributor list
   * 
   * @param contributor
   * @param contributorsFormArray
   * @param contributorsList 
   */
  private addContributor(contributor: ContributorClass, contributorsFormArray: FormArray, contributorsList: ContributorClass[]) {
    // Add to form
    contributorsFormArray.push(new FormControl(contributor));
    // Remove from list
    _.remove(contributorsList, { id: contributor.id });
  }

  public removeContributorLocation(contributor: ContributorClass) {
    this.removeContributor(contributor, this.eventContributorsForm.get('location') as FormArray, this.contributors.location);
  }

  public removeContributorFood(contributor: ContributorClass) {
    this.removeContributor(contributor, this.eventContributorsForm.get('food') as FormArray, this.contributors.food);
  }

  public removeContributorSkills(contributor: ContributorClass) {
    this.removeContributor(contributor, this.eventContributorsForm.get('skills') as FormArray, this.contributors.skills);
  }

  public removeContributorPeople(contributor: ContributorClass) {
    this.removeContributor(contributor, this.eventContributorsForm.get('people') as FormArray, this.contributors.people);
  }

  public removeContributorAssistants(contributor: ContributorClass) {
    this.removeContributor(contributor, this.eventContributorsForm.get('assistants') as FormArray, this.contributors.assistants);
  }

  private removeContributor(contributor: ContributorClass, contributorsFormArray: FormArray, contributorsList: ContributorClass[]) {
    // Add to list
    contributorsList.push(contributor);
    // Remove from form
    contributorsFormArray.removeAt(_.findIndex(contributorsFormArray.controls, c => c.value.id === contributor.id));
  }

  public submitForm(value) {
    Object.assign(this.event, {
      contributorsLocation: value.location,
      contributorsFood: value.food,
      contributorsSkills: value.skills,
      contributorsPeople: value.people,
      contributorsAssistants: value.assistants
    });
    this.eventService.setContributors(this.event.id, {
      contributorsLocation: _.map(this.event.contributorsLocation, 'id'),
      contributorsFood: _.map(this.event.contributorsFood, 'id'),
      contributorsSkills: _.map(this.event.contributorsSkills, 'id'),
      contributorsPeople: _.map(this.event.contributorsPeople, 'id'),
      contributorsAssistants: _.map(this.event.contributorsAssistants, 'id')
    }).subscribe(() => this.eventSaved.emit());
  }

}

interface ContributorGroups {
  location: ContributorClass[];
  food: ContributorClass[];
  skills: ContributorClass[];
  people: ContributorClass[];
  assistants: ContributorClass[]
}
