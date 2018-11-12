import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContributorService } from '../../services/contributor.service';
import { ContributorClass } from '../../domain/contributor.class';
import { AuthenticationService } from '../../services/authentication.service';
import { DialogComponent, DialogParams } from '../common/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { UserClass } from 'src/app/domain/user.class';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.css']
})
export class ContributorComponent implements OnInit {

  public contributor: ContributorClass;
  public readonly connectedUser: UserClass;

  constructor(private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private contributorService: ContributorService
  ) {
    this.connectedUser = this.authenticationService.user;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contributorService.getById(params['id']).subscribe(contributor => {
        this.contributor = contributor;
      })
    });
  }

  public deleteContributor(contributorId) {
    this.dialog.open<DialogComponent, DialogParams>(DialogComponent, {
      width: '550px',
      panelClass: 'dialog',
      data: {
        title: 'Suppression',
        body: 'Êtes-vous sûr de vouloir supprimer ce contributeur ?'
      }
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.contributorService.delete(contributorId).subscribe(() => {
          this.router.navigate(['/admin']);
        });
      }
    });
  }

  public modifyContributor(contributorId) {
    this.router.navigate(['admin', 'contributors', contributorId, 'edit']);
  }

  public get isConnected() {
    return this.authenticationService.isConnected;
  }
}
