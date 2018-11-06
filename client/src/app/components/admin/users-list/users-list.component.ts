import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserClass } from 'src/app/domain/user.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public readonly users: Observable<UserClass[]>;

  constructor(private userService: UserService) {
    this.users = this.userService.getAll().pipe(map((users: UserClass[]) => users.filter((user) => user.username !== 'Admin')));
  }

  ngOnInit() {
  }

}
