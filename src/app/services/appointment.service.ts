import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Appointment } from '@models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private pathAppointment: string = 'appointment'

  constructor(
    private webRequestService: WebRequestService
  ) { }

  getAppointments(filterIds: any) {
    return this.webRequestService.getWithHeaders(this.pathAppointment, filterIds, );
  }

  getAppointment(id: number) {
    return this.webRequestService.getWithHeaders(`${this.pathAppointment}/${id}`);
  }

  createAppointment(Appointment: any): Observable<any> {
    return this.webRequestService.postWithHeaders(this.pathAppointment, Appointment);
  }

  updateAppointment(id: number, Appointment: Appointment): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.pathAppointment}/${id}`, Appointment);
  }

  deleteAppointment(idAppointment: number): Observable<Appointment> {
    return this.webRequestService.deleteWithHeaders(`${this.pathAppointment}/${idAppointment}`);
  }

  deleteSelectedLevel(payload: number[]): Observable<Appointment[]> {
    return this.webRequestService.deleteWithHeaders(this.pathAppointment, undefined, payload);
  }
}
