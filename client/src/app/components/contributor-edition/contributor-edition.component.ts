import { Component, OnInit, Input } from '@angular/core';
import { ContributorClass } from '../../domain/contributor.class';
import { Router, ActivatedRoute } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';

@Component({
  selector: 'app-contributor-edition',
  templateUrl: './contributor-edition.component.html',
  styleUrls: ['./contributor-edition.component.css']
})
export class ContributorEditionComponent implements OnInit {

  public contributor: ContributorClass = new ContributorClass();

  constructor(private router: Router,
  private route: ActivatedRoute,
  private contributorService: ContributorService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contributorService.getById(params['id']).subscribe(event => {
        this.contributor = event;
      }, err => {
        console.error(err);
      })
    });
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
  }

}
