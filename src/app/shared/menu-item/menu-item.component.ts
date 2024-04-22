import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit{
  @Input() menuItems: MenuItem[];
  @Input() id: number;
  @Input() value: any;
  @Input() stopPropagation: boolean = false;

  items : MenuItem[];

  constructor() {}

  ngOnInit(): void {
    this.items = this.menuItems.map(e => ({ ...e }));
    this.items.forEach(element => {
      element['id'] = this.id.toString();
      element['value']  = this.value
    });
  }

  openMenu(menuIcon: any, event: Event){
    if(this.stopPropagation){
      event.stopPropagation();
    }
    menuIcon.toggle(event);
  }

}
