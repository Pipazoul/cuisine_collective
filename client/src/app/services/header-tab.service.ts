import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TabSelectionType } from '../enum/tab-selection-type.enum';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class HeaderTabService {

    public static readonly DEFAULT_TYPE = TabSelectionType.EVENTS;

    private readonly typeChanged = new BehaviorSubject<TabSelectionType>(null);

    private currentType = HeaderTabService.DEFAULT_TYPE;

    constructor(private authenticationService: AuthenticationService) {
        this.authenticationService.connectionStatusChanged.subscribe((connected) => {
            if (connected === true || connected === false) {
                this.setCurrentType(HeaderTabService.DEFAULT_TYPE);
            }
        });
    }

    public isTypeEvents(): boolean {
        return this.currentType === TabSelectionType.EVENTS;
    }

    public isTypeContributors(): boolean {
        return this.currentType === TabSelectionType.CONTRIBUTORS;
    }

    public getCurrentType(): TabSelectionType {
        return this.currentType;
    }

    public setCurrentType(type: TabSelectionType): TabSelectionType {
        this.typeChanged.next(this.currentType = type);
        return this.currentType;
    }

    public onTypeChanged(callback: (type: TabSelectionType) => void): Subscription {
        return this.typeChanged.subscribe(callback);
    }
}
