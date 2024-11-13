import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-level-compensations',
  templateUrl: './level-compensations.component.html',
  styleUrls: ['./level-compensations.component.scss']
})
export class LevelCompensationsComponent {
  functionality: Functionality = {
    label: 'Compensaciones laborales aplicadas al nivel por vigencias',
    icon: 'pi pi-money-bill',
    color: 'primary',
    description: 'Gestión de las compensaciones laborales aplicadas al nivel ocupacional por vigencias'
  };
}
