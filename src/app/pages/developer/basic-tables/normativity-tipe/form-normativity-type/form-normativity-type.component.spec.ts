import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNormativityTypeComponent } from './form-normativity-type.component';

describe('FormNormativityTypeComponent', () => {
  let component: FormNormativityTypeComponent;
  let fixture: ComponentFixture<FormNormativityTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormNormativityTypeComponent]
    });
    fixture = TestBed.createComponent(FormNormativityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
