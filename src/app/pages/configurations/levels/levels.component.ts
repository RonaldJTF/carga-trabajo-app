import { Component } from '@angular/core';
import { MenuService } from '@services';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent {
  constructor(
    public menuService: MenuService
  ){}
}
