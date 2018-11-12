import { Component, OnInit } from '@angular/core';
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
  public saved: boolean;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private contributorService: ContributorService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (!params['id']) {
        return;
      }
      this.contributorService.getById(params['id']).subscribe(event => {
        this.contributor = event;
      })
    });
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
    this.saved = true;
  }

}
