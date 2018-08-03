import { Input, EventEmitter, Output } from "@angular/core";
import { ContributorClass } from "../domain/contributor.class";
import { ContributorService } from "../services/contributor.service";

export abstract class AbstractContributorModifier {

    @Input() public contributor: ContributorClass;
    @Output() public backwardPressed: EventEmitter<ContributorClass> = new EventEmitter();
    @Output() public contributorSaved: EventEmitter<ContributorClass> = new EventEmitter();

    constructor(protected contributorService: ContributorService) {

    }

    protected saveContributor(contributorToSave: ContributorClass, goBack: boolean = false) {
        this.saveAndEmit(contributorToSave, (contributor) => goBack ? this.backwardPressed.emit(contributor) : this.contributorSaved.emit(contributor));
    }

    private saveAndEmit(contributor: ContributorClass, eventEmitter: (contributor: ContributorClass) => void) {
        if (!this.contributor.id) {
            this.contributorService.create(contributor).subscribe(
                (contributor) => { Object.assign(this.contributor, contributor); eventEmitter(contributor); }
            );
        } else {
            this.contributorService.update(contributor).subscribe(
                (contributor) => { Object.assign(this.contributor, contributor); eventEmitter(contributor); }
            );
        }
    }
}