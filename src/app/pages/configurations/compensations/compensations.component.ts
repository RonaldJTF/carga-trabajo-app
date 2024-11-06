import {Component} from '@angular/core';
import {MenuService} from "@services";

@Component({
  selector: 'app-compensations',
  templateUrl: './compensations.component.html',
  styleUrls: ['./compensations.component.scss']
})
export class CompensationsComponent {

  constructor(
    public menuService: MenuService
  ) {
  }

}
