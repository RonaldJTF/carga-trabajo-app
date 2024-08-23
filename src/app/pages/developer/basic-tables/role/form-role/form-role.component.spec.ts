import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRoleComponent } from './form-role.component';

describe('FormRolComponent', () => {
  let component: FormRoleComponent;
  let fixture: ComponentFixture<FormRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormRoleComponent]
    });
    fixture = TestBed.createComponent(FormRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
