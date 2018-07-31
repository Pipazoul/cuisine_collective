import { NativeDateAdapter } from '@angular/material';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class FrenchDateAdapter extends NativeDateAdapter {
  constructor() {
    super('fr-FR', new Platform());
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}