import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Utils
import { CustomRegExp } from '../../../util/CustomRegExp';
import { AbstractContributorModifier } from '../../../abstract/abstract-contributor-modifier';

// Services
import { ContributorService } from '../../../services/contributor.service';

// Classes
import { ContributorClass } from '../../../domain/contributor.class';

@Component({
  selector: 'app-contributor-form',
  templateUrl: './contributor-form.component.html',
  styleUrls: ['./contributor-form.component.css']
})
export class ContributorFormComponent extends AbstractContributorModifier implements OnInit {

  public contributorForm: FormGroup;

  constructor(@Inject(ContributorService) contributorService: ContributorService) {
    super(contributorService);
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.contributorForm = new FormGroup({
      'title': new FormControl(this.contributor.title, Validators.required),
      'description': new FormControl(this.contributor.description),
      'name': new FormControl(this.contributor.name),
      'hours': new FormControl(this.contributor.hours),
      'email': new FormControl(this.contributor.email, Validators.email),
      'phone': new FormControl(this.contributor.phone, Validators.pattern(CustomRegExp.PHONE)),
    });
  }

  public submitForm(value) {
    this.saveContributor(new ContributorClass(value));
  }

}
