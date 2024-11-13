import {Component} from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-compensations',
  templateUrl: './compensations.component.html',
  styleUrls: ['./compensations.component.scss']
})
export class CompensationsComponent {
  functionality: Functionality = {
    label: 'Compensaciones laborales',
    icon: 'pi pi-money-bill',
    color: 'primary',
    description: 'Gestión de las compensaciones laborales de los niveles ocupacionales'
  };
}
