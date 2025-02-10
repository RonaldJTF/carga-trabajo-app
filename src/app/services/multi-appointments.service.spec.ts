import { TestBed } from '@angular/core/testing';

import { MultiAppointmentService } from './multi-appointment.service';

describe('MultiAppointmentService', () => {
  let service: MultiAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
