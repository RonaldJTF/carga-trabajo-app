import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent {
  @Input() imageSize: number = 50;
  @Input() message: string = 'No se encontró resultados';
  @Input() srcImage: string = 'assets/content/images/no_results.png';
  @Input() styleClass: string = '';
}
