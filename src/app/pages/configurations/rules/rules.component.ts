import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent {
  functionality: Functionality = {
    label: 'Reglas',
    icon: 'pi pi-check-square',
    color: 'primary',
    description: 'Gestión de las reglas consideradas en las compensaciones laborales',
  };
}
