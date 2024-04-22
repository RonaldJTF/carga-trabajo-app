import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/layout/app.menu.service';

@Component({
  selector: 'app-structures',
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss']
})
export class StructuresComponent{
  constructor(
    public menuService: MenuService,
  ){}
}
