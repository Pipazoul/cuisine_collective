import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TabSelectionType } from '../enum/tab-selection-type.enum';

@Injectable()
export class HeaderTabService {

    public static readonly DEFAULT_TYPE = TabSelectionType.EVENTS;

    public readonly typeChanged = new BehaviorSubject<TabSelectionType>(null);

    constructor() {
    }
}
