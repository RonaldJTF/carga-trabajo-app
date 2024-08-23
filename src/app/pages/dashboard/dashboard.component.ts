import {Component} from '@angular/core';
import {MenuService} from "@services";

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
