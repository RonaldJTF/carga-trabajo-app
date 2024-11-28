import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-appointment-menu-item',
  templateUrl: './appointment-menu-item.component.html',
  styleUrls: ['./appointment-menu-item.component.scss']
})
export class AppointmentMenuItemComponent implements OnInit{
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
