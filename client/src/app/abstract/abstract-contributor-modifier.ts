import { Input, EventEmitter, Output } from "@angular/core";
import { ContributorClass } from "../domain/contributor.class";
import { ContributorService } from "../services/contributor.service";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication.service";
import { NotificationsService } from "angular2-notifications";

export abstract class AbstractContributorModifier {

    @Input() public contributor: ContributorClass;
    @Output() protected backwardPressed: EventEmitter<ContributorClass> = new EventEmitter();
    @Output() protected contributorChanged: EventEmitter<ContributorClass> = new EventEmitter();

    constructor(protected contributorService: ContributorService,
        protected authenticationService: AuthenticationService,
        protected notificationsService: NotificationsService) {

    }

    protected saveContributor(contributorToSave: ContributorClass, goBack: boolean = false): Observable<ContributorClass> {
        return this.saveAndEmit(contributorToSave, goBack ? this.backwardPressed : this.contributorChanged).pipe(catchError((err) => {
            this.notificationsService.error('Erreur', 'Erreur lors de l\'enregistrement du contributeur');
            throw err;
        }));
    }

    private saveAndEmit(contributor: ContributorClass, eventEmitter: EventEmitter<ContributorClass>): Observable<ContributorClass> {
        if (!this.contributor.id) {
            contributor.userId = this.authenticationService.user.id;
            return this.contributorService.create(contributor).pipe(
                tap((contributor) => { Object.assign(this.contributor, contributor); eventEmitter.emit(contributor); })
            );
        } else {
            return this.contributorService.update(contributor).pipe(
                tap((contributor) => { Object.assign(this.contributor, contributor); eventEmitter.emit(contributor); })
            );
        }
    }
}