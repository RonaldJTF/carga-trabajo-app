import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-normativities',
  templateUrl: './normativities.component.html',
  styleUrls: ['./normativities.component.scss']
})
export class NormativitiesComponent {
  functionality: Functionality = {
    label: 'Normatividades',
    icon: 'pi pi-calendar',
    color: 'primary',
    description: 'Gestión de normatividades que respaldan los procesos y los sistemas regulados'
  };
}
