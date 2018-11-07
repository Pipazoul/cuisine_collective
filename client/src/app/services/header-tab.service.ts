import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HeaderTabService {

    public readonly typeChanged = new BehaviorSubject<TabSelectionType>(null);

    constructor() {
    }
}

export enum TabSelectionType {
    EVENTS = 1,
    CONTRIBUTORS = 2
}
