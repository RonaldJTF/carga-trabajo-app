import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentMenuItemComponent } from './appointment-menu-item.component';

describe('AppointmentMenuItemComponent', () => {
  let component: AppointmentMenuItemComponent;
  let fixture: ComponentFixture<AppointmentMenuItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentMenuItemComponent]
    });
    fixture = TestBed.createComponent(AppointmentMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
