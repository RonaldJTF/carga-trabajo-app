import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActionButtonComponent } from './form-action-button.component';

describe('FormActionButtonComponent', () => {
  let component: FormActionButtonComponent;
  let fixture: ComponentFixture<FormActionButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormActionButtonComponent]
    });
    fixture = TestBed.createComponent(FormActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
