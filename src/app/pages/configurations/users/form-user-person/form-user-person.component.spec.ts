import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserPersonComponent } from './form-user-person.component';

describe('FormUserPersonComponent', () => {
  let component: FormUserPersonComponent;
  let fixture: ComponentFixture<FormUserPersonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormUserPersonComponent]
    });
    fixture = TestBed.createComponent(FormUserPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
