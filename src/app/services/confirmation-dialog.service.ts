import {Injectable} from '@angular/core';
import {ConfirmationService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private confirmationService: ConfirmationService) {
  }

  private showConfirmationDialog(
    message: string,
    header: string,
    acceptLabel: string,
    rejectLabel: string,
    acceptAction: () => void,
    rejectAction: () => void = () => {},
  ): void {
    this.confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: acceptLabel,
      rejectLabel: rejectLabel,
      accept: () => {
        acceptAction()
      },
      reject: () => {
        rejectAction()
      }
    });
  }

  showDeleteConfirmationDialog(acceptAction: () => void): void {
    this.showConfirmationDialog(
      '¿Está seguro de eliminar el registro?',
      'Confirmación',
      'Si',
      'No',
      acceptAction
    );
  }

  showEventConfirmationDialog(message: string = '¿Está seguro de eliminar el registro?', acceptAction: () => void, rejectAction: () => void): void {
    this.showConfirmationDialog(
      message,
      'Confirmación',
      'Si',
      'No',
      acceptAction,
      rejectAction,
    );
  }
}
