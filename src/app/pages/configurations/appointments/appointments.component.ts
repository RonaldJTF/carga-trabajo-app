import { Component } from '@angular/core';
import { Functionality } from '@models';
import { MenuService } from '@services';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent{
  constructor(
    public menuService: MenuService
  ){}
}
