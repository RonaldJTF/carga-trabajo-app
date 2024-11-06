import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLevelCompensationComponent } from './form-level-compensation.component';

describe('FormLevelCompensationComponent', () => {
  let component: FormLevelCompensationComponent;
  let fixture: ComponentFixture<FormLevelCompensationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormLevelCompensationComponent]
    });
    fixture = TestBed.createComponent(FormLevelCompensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
