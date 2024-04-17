import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-go-to-if-not-found',
  templateUrl: './go-to-if-not-found.component.html',
  styleUrls: ['./go-to-if-not-found.component.scss']
})
export class GoToIfNotFoundComponent {

  @Input() buttonLabel: string = "Crear";
  @Input() imageSize: number = 50;
  @Input() icon: string = 'pi-plus';
  @Input() message: string;

  @Output() go: EventEmitter<Event> = new EventEmitter<Event>();

  onGo(event : Event): void {
    event.preventDefault();
    this.go.emit(event);
  }

}
