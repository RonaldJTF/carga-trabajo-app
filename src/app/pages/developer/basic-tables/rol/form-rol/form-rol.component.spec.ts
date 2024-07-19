import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRolComponent } from './form-rol.component';

describe('FormRolComponent', () => {
  let component: FormRolComponent;
  let fixture: ComponentFixture<FormRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormRolComponent]
    });
    fixture = TestBed.createComponent(FormRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
