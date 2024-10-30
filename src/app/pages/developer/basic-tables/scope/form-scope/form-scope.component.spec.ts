import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormScopeComponent } from './form-scope.component';

describe('FormDocumenTypeComponent', () => {
  let component: FormScopeComponent;
  let fixture: ComponentFixture<FormScopeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormScopeComponent]
    });
    fixture = TestBed.createComponent(FormScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
