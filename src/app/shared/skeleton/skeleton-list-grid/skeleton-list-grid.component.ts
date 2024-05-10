import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-list-grid',
  templateUrl: './skeleton-list-grid.component.html',
  styleUrls: ['./skeleton-list-grid.component.scss']
})
export class SkeletonListGridComponent {
  @Input() isGrid: boolean = false;
  @Input() isList: boolean = false;
}
