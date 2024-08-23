import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-functionality',
  templateUrl: './functionality.component.html',
  styleUrls: ['./functionality.component.scss']
})
export class FunctionalityComponent{
  @Input() functionality: any;
}
