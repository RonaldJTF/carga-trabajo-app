import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompensationComponent } from './form-compensation.component';

describe('FormCompensationComponent', () => {
  let component: FormCompensationComponent;
  let fixture: ComponentFixture<FormCompensationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCompensationComponent]
    });
    fixture = TestBed.createComponent(FormCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
