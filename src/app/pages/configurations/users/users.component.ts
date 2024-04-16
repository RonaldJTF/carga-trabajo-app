import { Component } from '@angular/core';
import { MenuService } from 'src/app/layout/app.menu.service';

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
