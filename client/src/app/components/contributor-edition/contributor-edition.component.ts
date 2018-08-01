import { Component, OnInit, Input } from '@angular/core';
import { ContributorClass } from '../../domain/contributor.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contributor-edition',
  templateUrl: './contributor-edition.component.html',
  styleUrls: ['./contributor-edition.component.css']
})
export class ContributorEditionComponent implements OnInit {

  public contributor: ContributorClass = new ContributorClass();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public endCarousel() {
    this.router.navigate(['/admin']);
  }

}
