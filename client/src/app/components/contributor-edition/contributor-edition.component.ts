import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContributorClass } from '../../domain/contributor.class';
import { Router, ActivatedRoute } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';
import { RepresentedOnMapComponent } from '../base/represented-on-map/represented-on-map.component';

@Component({
  selector: 'app-contributor-edition',
  templateUrl: './contributor-edition.component.html',
  styleUrls: ['./contributor-edition.component.css']
})
export class ContributorEditionComponent extends RepresentedOnMapComponent  implements OnInit {

  public contributor: ContributorClass = new ContributorClass();
  public saved: boolean;

  constructor(private router: Router,
  private route: ActivatedRoute,
  private contributorService: ContributorService) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      this.contributorService.getById(params['id']).subscribe(event => {
        this.contributor = event;
      }, err => {
        console.error(err);
      })
    });
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
    this.saved = true;
  }

  deleteContributor(contributorId) {
    this.contributorService.delete(contributorId).subscribe(res => {
      this.removePoint.emit({type: ContributorClass, id: contributorId});
      this.router.navigate(['/admin']);
    }, err => {
      console.error(err);
    })
  }

}
