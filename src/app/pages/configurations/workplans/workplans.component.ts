import { Component } from '@angular/core';
import {MenuService} from "@services";

@Component({
  selector: 'app-workplans',
  templateUrl: './workplans.component.html',
  styleUrls: ['./workplans.component.scss']
})
export class WorkplansComponent {
  constructor(
    public menuService: MenuService
  ){}
}
