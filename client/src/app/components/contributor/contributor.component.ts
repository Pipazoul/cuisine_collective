import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';
import { ContributorClass } from '../../domain/contributor.class';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.css']
})
export class ContributorComponent implements OnInit {

  contributor: ContributorClass;

  constructor(private route: ActivatedRoute,
    private contributorService: ContributorService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contributorService.getById(params['id']).subscribe(contributor => {
        this.contributor = contributor;
      }, err => {
        console.error(err);
      })
    });
  }

}
