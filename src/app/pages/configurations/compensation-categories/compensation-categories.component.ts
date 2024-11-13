import { Component } from '@angular/core';
import { Functionality } from '@models';

@Component({
  selector: 'app-compensation-categories',
  templateUrl: './compensation-categories.component.html',
  styleUrls: ['./compensation-categories.component.scss']
})
export class CompensationCategoriesComponent {
  functionality: Functionality = {
    label: 'Categorías de compensaciones laborales',
    icon: 'pi pi-th-large',
    color: 'primary',
    description: 'Gestión de las categorías de las compensaciones laborales'
  };
}
