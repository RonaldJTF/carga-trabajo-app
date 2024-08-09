import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent {

  @Input() imageSize: number = 270;
  @Input() message: string = 'Las modificaciones en estas sección pueden afectar el funcionamiento del sistema. Por favor, asegúrese de entender los cambios antes de continuar.';
  @Input() srcImage: string = 'assets/content/images/illustrations/warning.svg';

}
