import {Component} from '@angular/core';
import {MenuService} from 'src/app/layout/app.menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    public menuService: MenuService
  ) {
  }
}
