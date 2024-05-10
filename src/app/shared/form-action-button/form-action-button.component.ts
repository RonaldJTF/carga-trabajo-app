import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';


@Component({
  selector: 'app-form-action-button',
  templateUrl: './form-action-button.component.html',
  styleUrls: ['./form-action-button.component.scss']
})
export class FormActionButtonComponent {
  @Input() updateMode: boolean;
  @Input() createOrCancelMode: boolean;
  @Input() disabledCreateOrUpdateButton: boolean;
  @Input() showDeleteButton: boolean = true;
  @Input() creatingOrUpdating: boolean = false;
  @Input() deleting: boolean = false;
  @Input() buttonCreateNamedAs: string = 'Crear';
  @Output() createOrUpdate: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() cancel: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() delete: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  onSubmitCreateOrUpdate(event : Event): void {
    event.preventDefault();
    this.createOrUpdate.emit(event);
  }

  onSubmitCancel(event : Event): void {
    event.preventDefault();
    this.cancel.emit(event);
  }

  onSubmitDelete(event : Event): void{
    event.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.delete.emit(event);
      }
    )
  }
}
