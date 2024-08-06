import {Component, Input, OnInit} from '@angular/core';
import {Message} from "primeng/api";

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent {

  @Input() imageSize: number = 270;
  @Input() message: string = 'Las modificaciones en estas tablas pueden afectar el funcionamiento del sistema. Por favor, asegúrese de entender los cambios antes de continuar.';
  @Input() srcImage: string = 'assets/content/images/illustrations/warning.svg';

}
