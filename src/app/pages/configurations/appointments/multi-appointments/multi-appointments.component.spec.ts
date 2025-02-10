import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAppointmentsComponent } from './multi-appointments.component';

describe('MultiAppointmentsComponent', () => {
  let component: MultiAppointmentsComponent;
  let fixture: ComponentFixture<MultiAppointmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiAppointmentsComponent]
    });
    fixture = TestBed.createComponent(MultiAppointmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
