import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent {
  functionality: Functionality = {
    label: 'Variables de compensaciones laborales',
    icon: 'pi pi-arrow-right-arrow-left',
    color: 'primary',
    description: 'Gestión de las variables consideradas en las compensaciones laborales',
  };
}
