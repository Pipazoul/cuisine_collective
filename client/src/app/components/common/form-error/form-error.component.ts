import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.css']
})
export class FormErrorComponent implements OnInit {

  private static readonly DEFAULT_ERRORS: object = {
    'required': 'Le champ est requis',
    'pattern': 'Le champ est invalide',
    'email': 'L\'adresse email est invalide',
    'emailAlreadyExists': 'L\'adresse email existe déjà'
  };

  @Input() public field: FormControl;
  @Input() public errors: object = {};
  public keys: string[] = [];

  constructor() { }

  ngOnInit() {
    this.initWithDefaults();
    this.computeKeys();
  }

  /**
   * Init default values to be displayed
   */
  private initWithDefaults() {
    if (!_.isPlainObject(this.errors)) {
      throw new Error('Input param \'errors\' must be a plain object');
    }
    _.defaults(this.errors, FormErrorComponent.DEFAULT_ERRORS);
  }

  /**
   * Extract keys from 'errors' object
   */
  private computeKeys() {
    this.keys = _.keys(this.errors);
  }
}
