import { Component, OnInit, Inject, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Utils
import { CustomRegExp } from '../../../util/CustomRegExp';
import { AbstractContributorModifier } from '../../../abstract/abstract-contributor-modifier';

// Services
import { ContributorService } from '../../../services/contributor.service';

// Classes
import { ContributorClass } from '../../../domain/contributor.class';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-contributor-services',
  templateUrl: './contributor-services.component.html',
  styleUrls: ['./contributor-services.component.css']
})
export class ContributorServicesComponent extends AbstractContributorModifier implements OnInit, OnChanges {

  public contributorForm: FormGroup;

  constructor(@Inject(ContributorService) contributorService: ContributorService,
    @Inject(AuthenticationService) authenticationService: AuthenticationService) {
    super(contributorService, authenticationService);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    this.contributorForm = new FormGroup({
      'location': new FormControl(this.contributor.location),
      'food': new FormControl(this.contributor.food),
      'skills': new FormControl(this.contributor.skills),
      'people': new FormControl(this.contributor.people),
      'assistants': new FormControl(this.contributor.assistants),
    });
  }

  public submitForm(value) {
    Object.assign(this.contributor, value);
    this.saveContributor(this.contributor).subscribe();
  }
}
