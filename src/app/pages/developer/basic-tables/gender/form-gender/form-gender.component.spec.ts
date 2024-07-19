import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenderComponent } from './form-gender.component';

describe('FormGenderComponent', () => {
  let component: FormGenderComponent;
  let fixture: ComponentFixture<FormGenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormGenderComponent]
    });
    fixture = TestBed.createComponent(FormGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
