import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMenuItemComponent } from './calendar-menu-item.component';

describe('CalendarMenuItemComponent', () => {
  let component: CalendarMenuItemComponent;
  let fixture: ComponentFixture<CalendarMenuItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarMenuItemComponent]
    });
    fixture = TestBed.createComponent(CalendarMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
