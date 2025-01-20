import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-organization-chart-menu-item',
  templateUrl: './organization-chart-menu-item.component.html',
  styleUrls: ['./organization-chart-menu-item.component.scss']
})
export class OrganizationChartMenuItemComponent implements OnInit{
  @Input() menuItems: MenuItem[];
  @Input() id: any;
  @Input() value: any;
  @Input() toggleIcon: boolean;

  items : MenuItem[];

  constructor(public element: ElementRef) {}

  ngOnInit(): void {
    this.items = this.menuItems.map(e => ({ ...e }));
    this.items.forEach(element => {
      element['id'] = this.id.toString();
      element['value']  = this.value
    });
  }

  openMenu(menuIcon: any, event: Event){
    menuIcon.toggle(event);
  }
}
