import {Component} from '@angular/core';
import {MenuService} from '@services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  constructor(
    public menuService: MenuService
  ){}
}
