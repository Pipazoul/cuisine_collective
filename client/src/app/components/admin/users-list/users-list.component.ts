import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserClass } from 'src/app/domain/user.class';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public users: UserClass[];

  constructor(private userService: UserService) {
    this.userService.getAll()
      .pipe(map((users: UserClass[]) => users.filter((user) => user.username !== 'Admin')))
      .subscribe((users) => this.users = users);
  }

  ngOnInit() {
  }

  public deleteUser(user: UserClass) {
    this.userService.deleteById(user.id).subscribe(() => _.remove(this.users, { id: user.id }));
  }

}
