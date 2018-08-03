import { Input, EventEmitter, Output } from "@angular/core";
import { ContributorClass } from "../domain/contributor.class";
import { ContributorService } from "../services/contributor.service";

export abstract class AbstractContributorModifier {

    @Input() public contributor: ContributorClass;
    @Output() public contributorSaved: EventEmitter<ContributorClass> = new EventEmitter();
    @Output() public backwardPressed: EventEmitter<any> = new EventEmitter();

    constructor(private contributorService: ContributorService) {
        
    }

    protected saveContributor(contributor: ContributorClass) {
        if (!this.contributor.id) {
            this.contributorService.create(contributor).subscribe(
                (contributor) => { Object.assign(this.contributor, contributor); this.contributorSaved.emit(contributor); }
            );
        } else {
            this.contributorService.update(contributor).subscribe(
                (contributor) => { Object.assign(this.contributor, contributor); this.contributorSaved.emit(contributor); }
            );
        }
    }

    public goBackward() {
        this.backwardPressed.emit();
    }
}