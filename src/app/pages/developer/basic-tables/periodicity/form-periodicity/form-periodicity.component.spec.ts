import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPeriodicityComponent } from './form-periodicity.component';

describe('FormPeriodicityComponent', () => {
  let component: FormPeriodicityComponent;
  let fixture: ComponentFixture<FormPeriodicityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPeriodicityComponent]
    });
    fixture = TestBed.createComponent(FormPeriodicityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
