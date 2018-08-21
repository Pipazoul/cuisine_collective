import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';
import { ContributorClass } from '../../domain/contributor.class';
import { RepresentedOnMapComponent } from '../base/represented-on-map/represented-on-map.component';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.css']
})
export class ContributorComponent extends RepresentedOnMapComponent implements OnInit {

  contributor: ContributorClass;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contributorService: ContributorService,
    public authService: AuthenticationService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contributorService.getById(params['id']).subscribe(contributor => {
        this.contributor = contributor;
      }, err => {
        console.error(err);
      })
    });
  }

  deleteContributor(contributorId) {
    this.contributorService.delete(contributorId).subscribe(res => {
      this.removePoint.emit({type: ContributorClass, id: contributorId});
      this.router.navigate(['/admin']);
    }, err => {
      console.error(err);
    })
  }

  modifyContributor(contributorId) {
    this.router.navigate(['admin', 'contributors', contributorId, 'edit']);
  }
}
