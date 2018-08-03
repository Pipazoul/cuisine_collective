import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContributorClass } from '../../domain/contributor.class';
import { Router, ActivatedRoute } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';

@Component({
  selector: 'app-contributor-edition',
  templateUrl: './contributor-edition.component.html',
  styleUrls: ['./contributor-edition.component.css']
})
export class ContributorEditionComponent implements OnInit {

  @Output() removePoint: EventEmitter<any> = new EventEmitter();
  public contributor: ContributorClass = new ContributorClass();

  constructor(private router: Router,
  private route: ActivatedRoute,
  private contributorService: ContributorService) { }

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
