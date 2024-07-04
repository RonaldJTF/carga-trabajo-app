import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
  @Input() buttonClass: string = "p-button-rounded p-button-text"

  items : MenuItem[];

  constructor() {}

  ngOnInit(): void {
    this.items = this.menuItems.map(e => ({ ...e }));
    this.assign(this.items);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuItems'] || changes['id'] || changes['value']) {
      this.items = this.menuItems.map(e => ({ ...e }));
      this.assign(this.items);
    }
  }

  assign(items: MenuItem[]){
    items.forEach(element => {
      element['id'] = this.id.toString();
      element['value']  = this.value;
      if(element.items){
        this.assign(element.items.map(e => ({ ...e })));
      }
    });
  }

  openMenu(menuIcon: any, event: Event){
    if(this.stopPropagation){
      event.stopPropagation();
    }
    menuIcon.toggle(event);
  }

}
