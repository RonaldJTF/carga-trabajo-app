import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/layout/app.menu.service';

@Component({
  selector: 'app-structures',
  templateUrl: './structures.component.html',
  styleUrls: ['./structures.component.scss']
})
export class StructuresComponent implements OnInit{
  functionality : any;
  constructor() {}

  ngOnInit(): void {
      this.functionality =  {
        label: 'Estructuras', 
        icon: 'pi pi-sitemap', 
        description: 'Gestión de estructuras de dependencias, procesos, procedimientos y actividades',
        color: "blue",
    }
  }
}