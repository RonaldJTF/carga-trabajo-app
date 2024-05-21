import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWorkplanComponent } from './form-workplan.component';

describe('FormPlanTrabajoComponent', () => {
  let component: FormWorkplanComponent;
  let fixture: ComponentFixture<FormWorkplanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormWorkplanComponent]
    });
    fixture = TestBed.createComponent(FormWorkplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
