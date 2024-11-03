import { Component } from '@angular/core';
import { Functionality } from '@models';
import { MenuService } from '@services';

@Component({
  selector: 'app-validities',
  templateUrl: './validities.component.html',
  styleUrls: ['./validities.component.scss']
})
export class ValiditiesComponent {
  functionality: Functionality = {
    label: 'Vigencias',
    icon: 'pi pi-calendar',
    color: 'primary',
    description: 'Gestión de las vigencias para las asignaciones laborales',
  };
}
