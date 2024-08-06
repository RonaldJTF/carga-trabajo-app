import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTypologyComponent } from './form-typology.component';

describe('FormTypologyComponent', () => {
  let component: FormTypologyComponent;
  let fixture: ComponentFixture<FormTypologyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormTypologyComponent]
    });
    fixture = TestBed.createComponent(FormTypologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
